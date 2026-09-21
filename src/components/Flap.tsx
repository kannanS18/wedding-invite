import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { getDigitHalfTextures } from '../lib/digitTextures';
import { audioController } from './AudioController';

interface FlapProps {
  currentValue: string;
  nextValue: string;
  isFlipping: boolean;
  width?: number;
  height?: number;
  depth?: number;
  flipDuration?: number;
  onFlipComplete: () => void;
  onImpactBounce?: () => void;
}

export const Flap: React.FC<FlapProps> = ({
  currentValue,
  nextValue,
  isFlipping,
  width = 1.16,
  height = 1.56,
  depth = 0.016,
  flipDuration = 0.52,
  onFlipComplete,
  onImpactBounce,
}) => {
  const pivotRef = useRef<THREE.Group>(null);
  const flapDarkenRef = useRef<THREE.MeshBasicMaterial>(null);

  const halfH = height / 2 - 0.008; // Gap at hinge

  // Get cached top texture for current value, and cached bottom texture for next value
  const frontTex = getDigitHalfTextures(currentValue).top;
  const backTex = getDigitHalfTextures(nextValue).bottom;

  const onFlipCompleteRef = useRef(onFlipComplete);
  onFlipCompleteRef.current = onFlipComplete;
  const onImpactBounceRef = useRef(onImpactBounce);
  onImpactBounceRef.current = onImpactBounce;

  // Reset flap rotation to 0 once flipping is completed and displayedVal has updated
  useEffect(() => {
    if (!isFlipping && pivotRef.current) {
      pivotRef.current.rotation.x = 0;
      if (flapDarkenRef.current) {
        flapDarkenRef.current.opacity = 0;
      }
    }
  }, [isFlipping]);

  // GSAP 3D Forward Flip Animation: ALWAYS rotates 100% full complete 180 degrees
  useEffect(() => {
    if (!isFlipping || !pivotRef.current) return;

    const pivot = pivotRef.current;
    pivot.rotation.x = 0;

    const fallDuration = flipDuration * 0.78;
    const settleDuration = flipDuration * 0.22;

    const tl = gsap.timeline({
      onComplete: () => {
        // Guarantee flap lands completely at Math.PI
        pivot.rotation.x = Math.PI;
        if (flapDarkenRef.current) {
          flapDarkenRef.current.opacity = 0;
        }
        onFlipCompleteRef.current();
      },
    });

    // 1. Gravity acceleration fall to impact (+180 degrees, swinging FORWARD towards camera)
    tl.to(pivot.rotation, {
      x: Math.PI,
      duration: fallDuration,
      ease: 'power2.in',
      onUpdate: () => {
        const progress = Math.min(1, Math.max(0, pivot.rotation.x / Math.PI));
        if (flapDarkenRef.current) {
          flapDarkenRef.current.opacity = Math.sin(progress * Math.PI) * 0.28;
        }
      },
    })
      // 2. Micro-overshoot & settle on impact
      .to(pivot.rotation, {
        x: Math.PI - 0.042, // ~2.4° bounce rebound off lower card
        duration: settleDuration * 0.5,
        ease: 'power1.out',
        onStart: () => {
          audioController.playFlapClick();
          if (onImpactBounceRef.current) onImpactBounceRef.current();
        },
      })
      .to(pivot.rotation, {
        x: Math.PI,
        duration: settleDuration * 0.5,
        ease: 'power1.in',
      });

    return () => {
      tl.kill();
    };
  }, [isFlipping, flipDuration]);

  return (
    <group ref={pivotRef} position={[0, 0, 0.016]}>
      {/* Front Face: Displays TOP half of CURRENT value */}
      <mesh position={[0, halfH / 2, depth / 2]} castShadow receiveShadow>
        <planeGeometry args={[width, halfH]} />
        <meshStandardMaterial
          map={frontTex}
          roughness={0.42}
          metalness={0.06}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Flap Self-Shading Darkening Overlay */}
      <mesh position={[0, halfH / 2, depth / 2 + 0.0006]}>
        <planeGeometry args={[width, halfH]} />
        <meshBasicMaterial
          ref={flapDarkenRef}
          color="#141010"
          transparent
          opacity={0}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Back Face: Displays BOTTOM half of NEXT value (rot X = PI makes it upright when flipped down) */}
      <mesh position={[0, halfH / 2, -depth / 2]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[width, halfH]} />
        <meshStandardMaterial
          map={backTex}
          roughness={0.42}
          metalness={0.06}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Flap Solid Core: Visible bevel cardstock edges as card cuts through the air */}
      <mesh position={[0, halfH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, halfH, depth - 0.001]} />
        <meshStandardMaterial color="#D9D3C7" roughness={0.5} metalness={0.08} />
      </mesh>
    </group>
  );
};
