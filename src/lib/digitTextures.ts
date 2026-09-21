import * as THREE from 'three';
import { CLOCK_CONFIG } from '../config';

interface TextureHalfPair {
  top: THREE.CanvasTexture;
  bottom: THREE.CanvasTexture;
}

const textureCache = new Map<string, TextureHalfPair>();
let fontsLoadedPromise: Promise<void> | null = null;

/**
 * Ensures fonts are fully loaded into the browser before drawing to Canvas.
 */
export async function ensureFontsLoaded(): Promise<void> {
  if (fontsLoadedPromise) return fontsLoadedPromise;

  fontsLoadedPromise = (async () => {
    try {
      if (typeof document !== 'undefined' && document.fonts) {
        await Promise.all([
          document.fonts.load('700 220px "Playfair Display"'),
          document.fonts.load('400 64px "Great Vibes"'),
          document.fonts.ready,
        ]);
      }
    } catch (e) {
      console.warn('Font loading check completed with fallback:', e);
    }
  })();

  return fontsLoadedPromise;
}

/**
 * Generates and caches separate top and bottom half textures for any text string.
 * This completely eliminates runtime texture cloning and UV offset manipulations.
 */
export function getDigitHalfTextures(
  value: string | number,
  cardBg = '#E5E0D8',
  textColor = '#201C1C'
): TextureHalfPair {
  const str = String(value).toUpperCase();
  const cacheKey = `${str}_${cardBg}_${textColor}`;

  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const width = 512;
  const halfHeight = 290; // Half of 580 total card height

  // Dynamic font sizing: large, bold, filling the luxury card prominently
  let fontSize = 320; // For 1-2 digits like "25", "21", "09"
  if (str.length === 3) {
    fontSize = 220; // For 3 letters like "SUN", "OCT", "MON", "WED"
  } else if (str.length >= 4) {
    fontSize = 185; // For 4 digits like "2026", "2025"
  }

  // Measure and ensure text fits comfortably within inner gold borders (max width 430px)
  const probeCanvas = document.createElement('canvas');
  const probeCtx = probeCanvas.getContext('2d');
  if (probeCtx && str && str !== 'EMPTY') {
    probeCtx.font = `700 ${fontSize}px "Playfair Display", Georgia, serif`;
    const measuredW = probeCtx.measureText(str).width;
    const maxAllowedW = width - 80; // 432px inside border
    if (measuredW > maxAllowedW) {
      fontSize = Math.floor(fontSize * (maxAllowedW / measuredW));
    }
  }

  const fontString = `700 ${fontSize}px "Playfair Display", Georgia, serif`;

  // 1. Render TOP Half Canvas
  const topCanvas = document.createElement('canvas');
  topCanvas.width = width;
  topCanvas.height = halfHeight;
  const topCtx = topCanvas.getContext('2d', { alpha: false });

  if (topCtx) {
    // Background
    topCtx.fillStyle = cardBg;
    topCtx.fillRect(0, 0, width, halfHeight);

    // Subtle soft gradient
    const grad = topCtx.createLinearGradient(0, 0, 0, halfHeight);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.05)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.12)'); // Crease shadow at bottom edge
    topCtx.fillStyle = grad;
    topCtx.fillRect(0, 0, width, halfHeight);

    // Gold borders (top, left, right)
    topCtx.strokeStyle = '#D4AF37';
    topCtx.lineWidth = 6;
    topCtx.strokeRect(16, 16, width - 32, halfHeight);

    topCtx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    topCtx.lineWidth = 2;
    topCtx.strokeRect(24, 24, width - 48, halfHeight);

    // Measure exact optical bounding box so the character is sliced EXACTLY 50/50 across top & bottom
    topCtx.font = fontString;
    const metrics = topCtx.measureText(str);
    const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.72;
    const descent = metrics.actualBoundingBoxDescent || 0;
    // visualCenterOffset: distance of glyph's optical center above the alphabetic baseline
    const visualCenterOffset = (ascent - descent) / 2;

    // Draw text on TOP canvas: optical center sits exactly at halfHeight (bottom edge)
    if (str && str !== 'EMPTY') {
      topCtx.fillStyle = textColor;
      topCtx.textAlign = 'center';
      topCtx.textBaseline = 'alphabetic';
      topCtx.fillText(str, width / 2, halfHeight + visualCenterOffset);
    }
  }

  // 2. Render BOTTOM Half Canvas
  const botCanvas = document.createElement('canvas');
  botCanvas.width = width;
  botCanvas.height = halfHeight;
  const botCtx = botCanvas.getContext('2d', { alpha: false });

  if (botCtx) {
    // Background
    botCtx.fillStyle = cardBg;
    botCtx.fillRect(0, 0, width, halfHeight);

    // Subtle soft gradient
    const grad = botCtx.createLinearGradient(0, 0, 0, halfHeight);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.04)');
    botCtx.fillStyle = grad;
    botCtx.fillRect(0, 0, width, halfHeight);

    // Gold borders (bottom, left, right)
    botCtx.strokeStyle = '#D4AF37';
    botCtx.lineWidth = 6;
    botCtx.strokeRect(16, -10, width - 32, halfHeight - 6);

    botCtx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    botCtx.lineWidth = 2;
    botCtx.strokeRect(24, -10, width - 48, halfHeight - 14);

    // Draw text on BOTTOM canvas: optical center sits exactly at y = 0 (top edge)
    if (str && str !== 'EMPTY') {
      botCtx.font = fontString;
      const metrics = botCtx.measureText(str);
      const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.72;
      const descent = metrics.actualBoundingBoxDescent || 0;
      const visualCenterOffset = (ascent - descent) / 2;

      botCtx.fillStyle = textColor;
      botCtx.textAlign = 'center';
      botCtx.textBaseline = 'alphabetic';
      botCtx.fillText(str, width / 2, visualCenterOffset);
    }
  }

  const topTex = new THREE.CanvasTexture(topCanvas);
  topTex.colorSpace = THREE.SRGBColorSpace;
  topTex.generateMipmaps = true;
  topTex.minFilter = THREE.LinearMipmapLinearFilter;
  topTex.magFilter = THREE.LinearFilter;

  const botTex = new THREE.CanvasTexture(botCanvas);
  botTex.colorSpace = THREE.SRGBColorSpace;
  botTex.generateMipmaps = true;
  botTex.minFilter = THREE.LinearMipmapLinearFilter;
  botTex.magFilter = THREE.LinearFilter;

  const pair: TextureHalfPair = { top: topTex, bottom: botTex };
  textureCache.set(cacheKey, pair);
  return pair;
}

/**
 * Pre-warms textures for blank cards, date, month, day and year values.
 */
export async function preheatDigitTextures(): Promise<void> {
  await ensureFontsLoaded();
  const allValues = [
    '', // Empty blank card
    'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT',
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
    '2024', '2025', '2026', '2027',
  ];

  // Preheat dates 1 to 31
  for (let d = 1; d <= 31; d++) {
    allValues.push(String(d));
    if (d < 10) allValues.push(`0${d}`);
  }

  // Process textures in small batches using requestIdleCallback to avoid blocking
  // the main thread during video playback
  const BATCH_SIZE = 6;
  return new Promise<void>((resolve) => {
    let index = 0;
    const processBatch = (deadline?: IdleDeadline) => {
      const batchEnd = Math.min(index + BATCH_SIZE, allValues.length);
      while (index < batchEnd) {
        getDigitHalfTextures(allValues[index]);
        index++;
      }
      if (index < allValues.length) {
        if (typeof requestIdleCallback !== 'undefined') {
          requestIdleCallback(processBatch);
        } else {
          setTimeout(() => processBatch(), 16);
        }
      } else {
        resolve();
      }
    };
    // Start first batch immediately
    processBatch();
  });
}

/**
 * Disposes all cached canvas textures to free GPU memory.
 */
export function disposeDigitTextures(): void {
  textureCache.forEach(({ top, bottom }) => {
    top.dispose();
    bottom.dispose();
  });
  textureCache.clear();
}
