import React, { useEffect, useState } from 'react';
import {
  Activity,
  Sliders,
  Sparkles,
  Volume2,
  X,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { CINEMA_PROFILES } from '../cinema-filters';
import { audioStudioEngine, type VuLevels } from '../audio-engine';
import type { CinemaLUT, StudioSettings } from '../types';

interface CinemaScopesModalProps {
  settings: StudioSettings;
  onUpdateSettings: (updater: (prev: StudioSettings) => StudioSettings) => void;
  histogramBins: number[];
  clippingPercent: number;
  onClose: () => void;
}

export const CinemaScopesModal: React.FC<CinemaScopesModalProps> = ({
  settings,
  onUpdateSettings,
  histogramBins,
  clippingPercent,
  onClose,
}) => {
  const [vu, setVu] = useState<VuLevels>({
    leftDb: -60,
    rightDb: -60,
    peakDb: -60,
    isClipping: false,
  });

  useEffect(() => {
    let animId: number;
    const pollVu = () => {
      setVu(audioStudioEngine.getVuLevels());
      animId = requestAnimationFrame(pollVu);
    };
    animId = requestAnimationFrame(pollVu);
    return () => cancelAnimationFrame(animId);
  }, []);

  const dbToPercent = (db: number) => {
    // -60dB -> 0%, 0dB -> 100%
    return Math.max(0, Math.min(100, ((db + 60) / 60) * 100));
  };

  return (
    <div className="absolute top-20 right-80 z-40 w-96 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black p-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Blackmagic Cinema Scopes
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 16-Bar Luminance Histogram */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-gray-300">
            Luminance Histogram (Exposure Waveform)
          </span>
          <div className="flex items-center gap-1.5">
            {clippingPercent > 3 ? (
              <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/20 px-1.5 py-0.2 rounded border border-red-500/30">
                CLIPPING {clippingPercent}%
              </span>
            ) : (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30">
                NORMAL
              </span>
            )}
          </div>
        </div>

        {/* 16-bar SVG visualization */}
        <div className="h-20 w-full bg-[#0a0d14] rounded-xl border border-white/10 p-2 flex items-end gap-1">
          {histogramBins.map((val, idx) => {
            const isHighlight = idx >= 14;
            const heightPercent = Math.max(6, Math.min(100, val * 100));
            return (
              <div
                key={idx}
                className="flex-1 rounded-t flex flex-col justify-end h-full group relative"
              >
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-sm transition-all duration-75 ${
                    isHighlight && clippingPercent > 0
                      ? 'bg-red-500'
                      : idx > 10
                      ? 'bg-amber-400'
                      : 'bg-cyan-500/80'
                  }`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-1 px-1">
          <span>0 (Shadows)</span>
          <span>128 (Midtones)</span>
          <span>255 (Highlights)</span>
        </div>
      </div>

      {/* Stereo Audio VU Meters */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-semibold text-gray-300">
              Stereo Audio VU Monitors
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-400">
            {vu.peakDb > -59 ? `${vu.peakDb.toFixed(1)} dB` : '-INF'}
          </span>
        </div>

        {/* Left channel */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-mono text-gray-400 w-3">L</span>
          <div className="flex-1 h-2 bg-gray-950 rounded-full overflow-hidden border border-white/10 relative">
            <div
              style={{ width: `${dbToPercent(vu.leftDb)}%` }}
              className={`h-full transition-all duration-75 ${
                vu.leftDb >= -3
                  ? 'bg-red-500 shadow-sm shadow-red-500'
                  : vu.leftDb >= -12
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
            />
          </div>
        </div>

        {/* Right channel */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-400 w-3">R</span>
          <div className="flex-1 h-2 bg-gray-950 rounded-full overflow-hidden border border-white/10 relative">
            <div
              style={{ width: `${dbToPercent(vu.rightDb)}%` }}
              className={`h-full transition-all duration-75 ${
                vu.rightDb >= -3
                  ? 'bg-red-500 shadow-sm shadow-red-500'
                  : vu.rightDb >= -12
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Zebras Toggle & Cinema LUT Quick Select */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.zebrasEnabled}
            onChange={(e) =>
              onUpdateSettings((prev) => ({
                ...prev,
                zebrasEnabled: e.target.checked,
              }))
            }
            className="rounded accent-amber-500"
          />
          <span>45° Highlight Zebras (&ge;95%)</span>
        </label>

        <span className="text-[10px] text-gray-500">Live Overexposure Guard</span>
      </div>
    </div>
  );
};
