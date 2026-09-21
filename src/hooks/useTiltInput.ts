import { useState, useEffect, useRef, useCallback } from 'react';

export interface TiltRef {
  x: number;
  y: number;
}

export interface TiltValues {
  tiltRef: React.MutableRefObject<TiltRef>;
  isGyroSupported: boolean;
  isGyroPermissionNeeded: boolean;
  requestGyroPermission: () => Promise<boolean>;
}

/**
 * Provides tilt input (gyroscope on mobile, mouse on desktop) for 3D scene parallax.
 *
 * CRITICAL PERF: Stores tilt values in a mutable ref — NOT React state.
 * The Three.js useFrame loop reads from tiltRef.current directly.
 * This avoids 60Hz React re-renders of the entire App component tree
 * which would starve the video decoder during intro playback.
 */
export function useTiltInput(): TiltValues {
  const tiltRef = useRef<TiltRef>({ x: 0, y: 0 });
  const [isGyroSupported, setIsGyroSupported] = useState(false);
  const [isGyroPermissionNeeded, setIsGyroPermissionNeeded] = useState(false);
  const gyroActiveRef = useRef(false);

  useEffect(() => {
    // Check iOS permission API
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
        .requestPermission === 'function'
    ) {
      setIsGyroSupported(true);
      setIsGyroPermissionNeeded(true);
    } else if (typeof window !== 'undefined' && 'ondeviceorientation' in window) {
      setIsGyroSupported(true);
      gyroActiveRef.current = true;
    }

    // Mouse parallax for desktop — writes to ref only, zero React re-renders
    const handleMouseMove = (e: MouseEvent) => {
      if (gyroActiveRef.current) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      const maxRad = (5 * Math.PI) / 180;

      tiltRef.current.x = ny * maxRad * 0.7;
      tiltRef.current.y = nx * maxRad;
    };

    // Device orientation for mobile — writes to ref only, zero React re-renders
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!gyroActiveRef.current || e.gamma === null || e.beta === null) return;
      const maxRad = (6 * Math.PI) / 180;
      const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
      const clampedBeta = Math.max(10, Math.min(60, e.beta)) - 35;

      tiltRef.current.x = (clampedBeta / 25) * maxRad * 0.6;
      tiltRef.current.y = (clampedGamma / 30) * maxRad;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const requestGyroPermission = useCallback(async (): Promise<boolean> => {
    const d = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof d.requestPermission === 'function') {
      try {
        const res = await d.requestPermission();
        if (res === 'granted') {
          gyroActiveRef.current = true;
          setIsGyroPermissionNeeded(false);
          return true;
        }
      } catch (err) {
        console.warn('DeviceOrientation permission rejected:', err);
      }
    }
    return false;
  }, []);

  return {
    tiltRef,
    isGyroSupported,
    isGyroPermissionNeeded,
    requestGyroPermission,
  };
}
