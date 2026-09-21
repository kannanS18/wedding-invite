import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Flap } from './Flap';
import { getDigitHalfTextures } from '../lib/digitTextures';

interface FlipTileProps {
  value: string;
  label: string;
  width?: number;
  height?: number;
  position?: [number, number, number];
  flipDuration?: number;
}

export const FlipTile: React.FC<FlipTileProps> = ({
  value,
  label: _label,
  width: customWidth,
  height = 1.62,
  position = [0, 0, 0],
  flipDuration = 0.38,
}) => {
  const formattedValue = String(value).toUpperCase();

  // displayedVal: the currently visible value on the card
  const [displayedVal, setDisplayedVal] = useState(formattedValue);
  // nextVal: the value currently flipping to
  const [nextVal, setNextVal] = useState(formattedValue);
  const [isFlipping, setIsFlipping] = useState(false);

  const nextValRef = useRef(nextVal);
  nextValRef.current = nextVal;

  const queueRef = useRef<string[]>([]);
  const isFlippingRef = useRef(false);
  const tileGroupRef = useRef<THREE.Group>(null);

  const width = useMemo(() => {
    if (customWidth) return customWidth;
    if (formattedValue.length >= 4) return 1.34;
    if (formattedValue.length === 3) return 1.22;
    return 1.16;
  }, [customWidth, formattedValue.length]);

  const depth = 0.04;
  const halfH = height / 2 - 0.006;

  // Cached textures:
  // Static top half shows NEXT value (revealed when the flap falls forward)
  const staticTopTex = getDigitHalfTextures(nextVal).top;
  // Static bottom half shows DISPLAYED value until flap lands
  const staticBottomTex = getDigitHalfTextures(displayedVal).bottom;

  // Metallic hinge material for side mounting lugs only
  const hingeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#B39148',
        metalness: 0.92,
        roughness: 0.28,
      }),
    []
  );

  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      isFlippingRef.current = false;
      setIsFlipping(false);
      return;
    }

    const target = queueRef.current.shift()!;
    setDisplayedVal((curr) => {
      if (curr === target) {
        processQueue();
        return curr;
      }
      setNextVal(target);
      isFlippingRef.current = true;
      setIsFlipping(true);
      return curr;
    });
  }, []);

  useEffect(() => {
    if (formattedValue === displayedVal && queueRef.current.length === 0) return;

    queueRef.current.push(formattedValue);

    if (!isFlippingRef.current) {
      processQueue();
    }
  }, [formattedValue, displayedVal, processQueue]);

  const handleFlipComplete = useCallback(() => {
    // When flap finishes landing: commit new value
    setDisplayedVal(nextValRef.current);
    isFlippingRef.current = false;
    setIsFlipping(false);

    if (queueRef.current.length > 0) {
      requestAnimationFrame(() => {
        processQueue();
      });
    }
  }, [processQueue]);

  const handleImpactBounce = useCallback(() => {
    if (!tileGroupRef.current) return;
    gsap.to(tileGroupRef.current.position, {
      y: position[1] - 0.014,
      duration: 0.06,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
    });
  }, [position]);

  return (
    <group ref={tileGroupRef} position={position}>
      {/* 1. Static Top Half: Front face at z = 0.001 (BEHIND the flap which is at z = 0.024) */}
      <group position={[0, halfH / 2 + 0.005, 0]}>
        <mesh position={[0, 0, 0.001]} receiveShadow>
          <planeGeometry args={[width, halfH]} />
          <meshStandardMaterial map={staticTopTex} roughness={0.45} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0, -depth / 2]} castShadow receiveShadow>
          <boxGeometry args={[width, halfH, depth]} />
          <meshStandardMaterial color="#E5E0D8" roughness={0.65} metalness={0.04} />
        </mesh>
      </group>

      {/* 2. Static Bottom Half: Front face at z = 0.001 (BEHIND the landed flap which is at z = 0.024) */}
      <group position={[0, -halfH / 2 - 0.005, 0]}>
        <mesh position={[0, 0, 0.001]} receiveShadow>
          <planeGeometry args={[width, halfH]} />
          <meshStandardMaterial map={staticBottomTex} roughness={0.45} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0, -depth / 2]} castShadow receiveShadow>
          <boxGeometry args={[width, halfH, depth]} />
          <meshStandardMaterial color="#E5E0D8" roughness={0.65} metalness={0.04} />
        </mesh>
      </group>

      {/* 3. The Hinged Flap: Pivots in front of static cards */}
      <Flap
        currentValue={displayedVal}
        nextValue={nextVal}
        isFlipping={isFlipping}
        width={width}
        height={height}
        flipDuration={flipDuration}
        onFlipComplete={handleFlipComplete}
        onImpactBounce={handleImpactBounce}
      />

      {/* 4. Side Hinge Mounting Clips ONLY on the far left and right edges (NO rod across numbers!) */}
      <group position={[0, 0, 0.016]}>
        {/* Left Side Hinge Ring */}
        <mesh position={[-width / 2 - 0.016, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.024, 0.024, 0.030, 16]} />
          <primitive object={hingeMat} attach="material" />
        </mesh>

        {/* Right Side Hinge Ring */}
        <mesh position={[width / 2 + 0.016, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.024, 0.024, 0.030, 16]} />
          <primitive object={hingeMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
};
