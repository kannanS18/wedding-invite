import { useState, useEffect } from 'react';

export type QualityTier = 'high' | 'medium' | 'low';

export interface QualityConfig {
  tier: QualityTier;
  dpr: [number, number];
  shadowMapSize: number;
}

export function useQualityTier(requestedQuality: 'auto' | QualityTier = 'auto'): QualityConfig {
  const [tier, setTier] = useState<QualityTier>(() => {
    if (requestedQuality !== 'auto') return requestedQuality;

    if (typeof window === 'undefined') return 'medium';

    // Simple heuristic for mobile / low-power detection
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;

    if (isMobile) {
      return cores <= 4 ? 'low' : 'medium';
    }
    return cores >= 8 ? 'high' : 'medium';
  });

  useEffect(() => {
    if (requestedQuality !== 'auto') {
      setTier(requestedQuality);
    }
  }, [requestedQuality]);

  switch (tier) {
    case 'high':
      return {
        tier: 'high',
        dpr: [1, 2],
        shadowMapSize: 2048,
      };
    case 'medium':
      return {
        tier: 'medium',
        dpr: [1, 1.5],
        shadowMapSize: 1024,
      };
    case 'low':
    default:
      return {
        tier: 'low',
        dpr: [1, 1.25],
        shadowMapSize: 512,
      };
  }
}
