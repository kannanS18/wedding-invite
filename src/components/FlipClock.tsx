import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { FlipTile } from './FlipTile';
import { CLOCK_CONFIG } from '../config';

import { getDynamicDateSteps } from '../lib/dynamicDateSequence';

interface FlipClockProps {
  startAnimation: boolean;
  onAnimationComplete?: () => void;
}

export const FlipClock: React.FC<FlipClockProps> = ({
  startAnimation,
  onAnimationComplete,
}) => {
  const { viewport } = useThree();

  // Responsive scale: guaranteed to fit on any mobile width without clipping
  const baseWidth = 5.35;
  const responsiveScale = useMemo(() => {
    // Fits neatly within 92% of available viewport width
    const targetScale = (viewport.width * 0.92) / baseWidth;
    return Math.min(1.05, targetScale);
  }, [viewport.width]);

  // Dynamically compute cascade steps starting from current date and ending on wedding date
  const dynamicSteps = useMemo(() => getDynamicDateSteps(), []);

  // All cards start with today's real date from the very first frame — NEVER blank!
  const [displayDay, setDisplayDay] = useState(dynamicSteps.day[0] || CLOCK_CONFIG.revealValues.day);
  const [displayDate, setDisplayDate] = useState(dynamicSteps.date[0] || CLOCK_CONFIG.revealValues.date);
  const [displayMonth, setDisplayMonth] = useState(dynamicSteps.month[0] || CLOCK_CONFIG.revealValues.month);
  const [displayYear, setDisplayYear] = useState(dynamicSteps.year[0] || CLOCK_CONFIG.revealValues.year);

  const animationTriggeredRef = useRef(false);

  useEffect(() => {
    if (!startAnimation || animationTriggeredRef.current) return;
    animationTriggeredRef.current = true;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayDay(CLOCK_CONFIG.revealValues.day);
      setDisplayDate(CLOCK_CONFIG.revealValues.date);
      setDisplayMonth(CLOCK_CONFIG.revealValues.month);
      setDisplayYear(CLOCK_CONFIG.revealValues.year);
      if (onAnimationComplete) onAnimationComplete();
      return;
    }

    const timers: number[] = [];

    const playSequence = (
      steps: string[],
      setter: (v: string) => void,
      startDelay: number,
      stepInterval: number
    ): Promise<void> => {
      return new Promise((resolve) => {
        const remainingSteps = steps.slice(1);
        let currentDelay = startDelay;
        remainingSteps.forEach((step, idx) => {
          const t = window.setTimeout(() => {
            setter(step);
            if (idx === remainingSteps.length - 1) {
              resolve();
            }
          }, currentDelay);
          timers.push(t);
          currentDelay += stepInterval;
        });
      });
    };

    // Staggered cascade: moves dynamically from current date to wedding date
    Promise.all([
      playSequence(dynamicSteps.day, setDisplayDay, 350, 520),
      playSequence(dynamicSteps.date, setDisplayDate, 400, 500),
      playSequence(dynamicSteps.month, setDisplayMonth, 650, 560),
      playSequence(dynamicSteps.year, setDisplayYear, 850, 600),
    ]).then(() => {
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, 400);
      }
    });

    return () => {
      timers.forEach((id) => clearTimeout(id));
    };
  }, [startAnimation, dynamicSteps, onAnimationComplete]);

  // Proportional horizontal positions for larger cards
  const dayX = -2.05;
  const dateX = -0.68;
  const monthX = 0.68;
  const yearX = 2.05;

  const labelStyle: React.CSSProperties = {
    fontFamily: '"Montserrat", "Playfair Display", sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.24em',
    color: '#8A7A6E',
    textAlign: 'center',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    pointerEvents: 'none',
    marginTop: '6px',
  };

  return (
    <group scale={[responsiveScale, responsiveScale, responsiveScale]}>
      {/* 1. DAY TILE */}
      <group position={[dayX, 0, 0]}>
        <FlipTile
          value={displayDay}
          label={CLOCK_CONFIG.labels.day}
          width={1.22}
          height={1.62}
          flipDuration={0.38}
        />
        <Html center position={[0, -1.18, 0]}>
          <div style={labelStyle}>{CLOCK_CONFIG.labels.day}</div>
        </Html>
      </group>

      {/* 2. DATE TILE */}
      <group position={[dateX, 0, 0]}>
        <FlipTile
          value={displayDate}
          label={CLOCK_CONFIG.labels.date}
          width={1.16}
          height={1.62}
          flipDuration={0.38}
        />
        <Html center position={[0, -1.18, 0]}>
          <div style={labelStyle}>{CLOCK_CONFIG.labels.date}</div>
        </Html>
      </group>

      {/* 3. MONTH TILE */}
      <group position={[monthX, 0, 0]}>
        <FlipTile
          value={displayMonth}
          label={CLOCK_CONFIG.labels.month}
          width={1.22}
          height={1.62}
          flipDuration={0.38}
        />
        <Html center position={[0, -1.18, 0]}>
          <div style={labelStyle}>{CLOCK_CONFIG.labels.month}</div>
        </Html>
      </group>

      {/* 4. YEAR TILE */}
      <group position={[yearX, 0, 0]}>
        <FlipTile
          value={displayYear}
          label={CLOCK_CONFIG.labels.year}
          width={1.34}
          height={1.62}
          flipDuration={0.38}
        />
        <Html center position={[0, -1.18, 0]}>
          <div style={labelStyle}>{CLOCK_CONFIG.labels.year}</div>
        </Html>
      </group>
    </group>
  );
};
