import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { FlipClock } from './FlipClock';
import { QualityConfig } from '../hooks/useQualityTier';
import { TiltRef } from '../hooks/useTiltInput';

interface SceneProps {
  startAnimation: boolean;
  quality: QualityConfig;
  tiltRef: React.MutableRefObject<TiltRef>;
  isVisible?: boolean;
  onAnimationComplete?: () => void;
}

const ResponsiveCamera: React.FC = () => {
  const { camera, size } = useThree();

  useFrame(() => {
    const aspect = size.width / size.height;
    // Elevated desk perspective (~8-10 degrees looking down) to showcase 3D flip depth and shadow casting
    if (aspect < 0.6) {
      camera.position.z = 8.4;
      camera.position.y = 0.70;
    } else if (aspect < 1.0) {
      camera.position.z = 7.7;
      camera.position.y = 0.78;
    } else {
      camera.position.z = 7.0;
      camera.position.y = 0.85;
    }
    camera.lookAt(0, -0.06, 0);
  });

  return null;
};

const ClockRig: React.FC<{
  startAnimation: boolean;
  tiltRef: React.MutableRefObject<TiltRef>;
  onAnimationComplete?: () => void;
}> = ({ startAnimation, tiltRef, onAnimationComplete }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Gentle vertical idle float
    groupRef.current.position.y = Math.sin(t * 0.75) * 0.035;

    // Read LIVE tilt values from the mutable ref (zero React re-renders)
    const targetRotX = tiltRef.current.x - 0.05;
    const targetRotY = tiltRef.current.y;

    // Smooth spring damping for mouse / gyroscope parallax tilt
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.08
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.08
    );
  });

  return (
    <group ref={groupRef}>
      <FlipClock
        startAnimation={startAnimation}
        onAnimationComplete={onAnimationComplete}
      />
    </group>
  );
};

export const Scene: React.FC<SceneProps> = ({
  startAnimation,
  quality,
  tiltRef,
  isVisible = true,
  onAnimationComplete,
}) => {
  return (
    <Canvas
      frameloop={isVisible ? 'always' : 'never'}
      shadows
      dpr={quality.dpr}
      camera={{
        fov: 38,
        position: [0, 0.25, 7.8],
      }}
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        antialias: true,
        alpha: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      }}
      onCreated={({ gl }) => {
        // Prevent default on webglcontextlost to allow smooth automatic context restoration
        gl.domElement.addEventListener(
          'webglcontextlost',
          (event) => {
            event.preventDefault();
          },
          false
        );
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <ResponsiveCamera />

      {/* 1. Self-hosted Studio Environment Map in its own Suspense so the clock is NEVER blocked */}
      <Suspense fallback={null}>
        <Environment files={`${import.meta.env.BASE_URL}hdri/studio.hdr`} />
      </Suspense>

      {/* 2. Direct Studio Lighting - available immediately on Frame 0 */}
      <ambientLight color="#FFF8F0" intensity={0.9} />

      {/* Key Directional Light with Soft Shadows */}
      <directionalLight
        position={[3, 5.5, 4.5]}
        intensity={1.4}
        color="#FFFDF5"
        castShadow
        shadow-mapSize={[quality.shadowMapSize, quality.shadowMapSize]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />

      {/* Warm Fill Light */}
      <directionalLight position={[-3.5, 2, 3]} intensity={0.7} color="#FFF5E6" />

      {/* Gold Rim Kicker */}
      <directionalLight position={[0, -3, -2]} intensity={0.85} color="#D4AF37" />

      {/* 3. Floating Gold Dust Particles in the Light Beam */}
      <Sparkles
        count={35}
        scale={8}
        size={2.2}
        speed={0.25}
        opacity={0.35}
        color="#D4AF37"
      />

      {/* 4. Flip Clock Assembly with Parallax Rig - Renders instantly */}
      <ClockRig
        startAnimation={startAnimation}
        tiltRef={tiltRef}
        onAnimationComplete={onAnimationComplete}
      />

      {/* 5. Realistic Soft Contact Shadows on the Tabletop Surface */}
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.55}
        scale={12}
        blur={2.0}
        far={3.5}
        color="#554638"
        frames={1}
      />
    </Canvas>
  );
};
