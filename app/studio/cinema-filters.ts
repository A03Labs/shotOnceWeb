import type { CinemaLUT } from './types';

export interface CinemaLUTProfile {
  id: CinemaLUT;
  name: string;
  badge: string;
  description: string;
  canvasFilter: string;
  accentColor: string;
}

export const CINEMA_PROFILES: Record<CinemaLUT, CinemaLUTProfile> = {
  'standard': {
    id: 'standard',
    name: 'Rec.709 Standard',
    badge: 'REC.709',
    description: 'Clean, neutral optical color balance true to source sensor.',
    canvasFilter: 'none',
    accentColor: '#3b82f6',
  },
  'cinema-warm': {
    id: 'cinema-warm',
    name: 'Cinema Warm',
    badge: 'WARM 3200K',
    description: 'Golden hour amber roll-off with rich skin tones & tungsten highlights.',
    canvasFilter: 'contrast(1.08) saturate(1.22) sepia(0.18) hue-rotate(-8deg)',
    accentColor: '#e5a93c',
  },
  'cool-teal': {
    id: 'cool-teal',
    name: 'Cool Blockbuster',
    badge: 'TEAL/ORANGE',
    description: 'Modern Hollywood teal shadows with punchy orange midtones.',
    canvasFilter: 'contrast(1.15) saturate(1.25) hue-rotate(14deg) brightness(0.98)',
    accentColor: '#14b8a6',
  },
  'noir': {
    id: 'noir',
    name: 'Noir Silver-Halide',
    badge: 'MONO B&W',
    description: 'Deep contrast monochrome with rich dynamic shadow roll-off.',
    canvasFilter: 'grayscale(1) contrast(1.35) brightness(0.94)',
    accentColor: '#9ca3af',
  },
  'flat-log': {
    id: 'flat-log',
    name: 'Flat Log Curve',
    badge: 'LOG C',
    description: 'De-contrasted flat curve preserving max dynamic range for grading.',
    canvasFilter: 'contrast(0.78) brightness(1.12) saturate(0.82)',
    accentColor: '#a855f7',
  },
};

/**
 * Computes 16-bin luminance histogram from downsampled canvas
 */
export function computeLuminanceHistogram(
  ctx: CanvasRenderingContext2D,
  sampleWidth = 160,
  sampleHeight = 90
): { bins: number[]; clippingPercent: number } {
  const bins = new Array(16).fill(0);
  try {
    const imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
    const data = imgData.data;
    const totalPixels = sampleWidth * sampleHeight;
    let clippedCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // ITU-R BT.709 luma calculation
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      const binIndex = Math.min(15, Math.floor((luma / 256) * 16));
      bins[binIndex]++;

      if (luma >= 242) {
        clippedCount++;
      }
    }

    // Normalize bin counts 0 to 1
    const maxVal = Math.max(...bins, 1);
    const normalizedBins = bins.map((v) => v / maxVal);
    const clippingPercent = Math.min(100, Math.round((clippedCount / totalPixels) * 100));

    return { bins: normalizedBins, clippingPercent };
  } catch {
    return { bins: new Array(16).fill(0.1), clippingPercent: 0 };
  }
}

/**
 * Draws highlight zebra stripes on areas exceeding threshold on a 2D canvas
 */
export function drawHighlightZebras(
  destCtx: CanvasRenderingContext2D,
  width: number,
  height: number,
  threshold = 242
) {
  try {
    const imgData = destCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    destCtx.save();
    destCtx.strokeStyle = '#ef4444';
    destCtx.lineWidth = 1.5;

    // Scan every 8th pixel to keep performance locked at 60fps
    const step = 8;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        const luma = 0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2];
        if (luma >= threshold) {
          // Draw small 45-degree zebra slash
          destCtx.beginPath();
          destCtx.moveTo(x - 3, y + 3);
          destCtx.lineTo(x + 3, y - 3);
          destCtx.stroke();
        }
      }
    }
    destCtx.restore();
  } catch {
    // Canvas might be tainted or out of bounds; gracefully skip
  }
}
