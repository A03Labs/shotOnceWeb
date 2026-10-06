import React, { useEffect, useRef } from 'react';
import {
  Monitor,
  Smartphone,
  Square,
  RectangleVertical,
  Crosshair,
  Download,
  CheckCircle2,
  Sliders,
  Layers
} from 'lucide-react';
import { ASPECT_RATIOS, type AspectRatioId, type StudioSettings } from '../types';
import { calculateAspectCrop } from '../derivation-exporter';

interface DerivationPreviewBarProps {
  settings: StudioSettings;
  onUpdateSettings: (updater: (prev: StudioSettings) => StudioSettings) => void;
  masterCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  onExportAspect?: (aspectId: AspectRatioId) => void;
}

export const DerivationPreviewBar: React.FC<DerivationPreviewBarProps> = ({
  settings,
  onUpdateSettings,
  masterCanvasRef,
  onExportAspect,
}) => {
  const canvasRefs = {
    '16:9': useRef<HTMLCanvasElement | null>(null),
    '9:16': useRef<HTMLCanvasElement | null>(null),
    '1:1': useRef<HTMLCanvasElement | null>(null),
    '4:5': useRef<HTMLCanvasElement | null>(null),
  };

  // Sync preview canvases at 15-20fps from master
  useEffect(() => {
    let animId: number;
    const updatePreviews = () => {
      const master = masterCanvasRef.current;
      if (master) {
        const aspects: AspectRatioId[] = ['16:9', '9:16', '1:1', '4:5'];
        aspects.forEach((id) => {
          const miniCanvas = canvasRefs[id].current;
          if (miniCanvas) {
            const miniCtx = miniCanvas.getContext('2d');
            if (miniCtx) {
              const crop = calculateAspectCrop(
                master.width,
                master.height,
                id,
                settings.anchorPoint.x,
                settings.anchorPoint.y
              );
              miniCtx.clearRect(0, 0, miniCanvas.width, miniCanvas.height);
              miniCtx.drawImage(
                master,
                crop.sx,
                crop.sy,
                crop.sWidth,
                crop.sHeight,
                0,
                0,
                miniCanvas.width,
                miniCanvas.height
              );
            }
          }
        });
      }
      animId = requestAnimationFrame(updatePreviews);
    };

    animId = requestAnimationFrame(updatePreviews);
    return () => cancelAnimationFrame(animId);
  }, [settings.anchorPoint]);

  const toggleAspect = (id: AspectRatioId) => {
    onUpdateSettings((prev) => {
      const exists = prev.activeDerivations.includes(id);
      if (exists) {
        // Keep at least one
        if (prev.activeDerivations.length === 1) return prev;
        return {
          ...prev,
          activeDerivations: prev.activeDerivations.filter((x) => x !== id),
        };
      } else {
        return {
          ...prev,
          activeDerivations: [...prev.activeDerivations, id],
        };
      }
    });
  };

  return (
    <div className="w-full bg-[#131518] px-6 py-3 shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1C2026] flex items-center justify-center">
            <Layers className="w-4 h-4 text-[#E5A93C]" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#F3F5F7]">
                Simultaneous Derivations
              </span>
              <span className="text-[10px] bg-[#1C2026] text-[#10B981] px-1.5 py-0.5 rounded font-mono">
                ZERO DELAY
              </span>
            </div>
            <p className="text-[11px] text-[#969EAA]">
              Capture once &rarr; derive all formats simultaneously in device memory
            </p>
          </div>
        </div>

        {/* 4 Mini Live Aspect Canvases */}
        <div className="flex items-center gap-3">
          {/* 16:9 Landscape */}
          <div
            onClick={() => toggleAspect('16:9')}
            className={`group relative p-1.5 rounded-lg transition-colors cursor-pointer flex flex-col items-center ${
              settings.activeDerivations.includes('16:9')
                ? 'bg-[#1C2026]'
                : 'opacity-40 hover:opacity-80'
            }`}
          >
            <div className="relative w-28 h-16 bg-[#07080A] rounded overflow-hidden">
              <canvas
                ref={canvasRefs['16:9']}
                width={160}
                height={90}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/70 text-[9px] font-mono text-gray-300">
                16:9
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <Monitor className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-medium text-gray-300">YouTube / 4K</span>
            </div>
          </div>

          {/* 9:16 Vertical */}
          <div
            onClick={() => toggleAspect('9:16')}
            className={`group relative p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center ${
              settings.activeDerivations.includes('9:16')
                ? 'bg-white/10 border-amber-500/50 shadow-md shadow-amber-500/10'
                : 'bg-white/5 border-white/10 opacity-50 hover:opacity-80'
            }`}
          >
            <div className="relative w-12 h-16 bg-black rounded-lg overflow-hidden border border-white/10">
              <canvas
                ref={canvasRefs['9:16']}
                width={90}
                height={160}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/70 text-[9px] font-mono text-amber-400">
                9:16
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-medium text-gray-300">TikTok / Reels</span>
            </div>
          </div>

          {/* 1:1 Square */}
          <div
            onClick={() => toggleAspect('1:1')}
            className={`group relative p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center ${
              settings.activeDerivations.includes('1:1')
                ? 'bg-white/10 border-amber-500/50 shadow-md shadow-amber-500/10'
                : 'bg-white/5 border-white/10 opacity-50 hover:opacity-80'
            }`}
          >
            <div className="relative w-16 h-16 bg-black rounded-lg overflow-hidden border border-white/10">
              <canvas
                ref={canvasRefs['1:1']}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/70 text-[9px] font-mono text-blue-400">
                1:1
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <Square className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-medium text-gray-300">Instagram / X</span>
            </div>
          </div>

          {/* 4:5 Portrait */}
          <div
            onClick={() => toggleAspect('4:5')}
            className={`group relative p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center ${
              settings.activeDerivations.includes('4:5')
                ? 'bg-white/10 border-amber-500/50 shadow-md shadow-amber-500/10'
                : 'bg-white/5 border-white/10 opacity-50 hover:opacity-80'
            }`}
          >
            <div className="relative w-14 h-16 bg-black rounded-lg overflow-hidden border border-white/10">
              <canvas
                ref={canvasRefs['4:5']}
                width={96}
                height={120}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/70 text-[9px] font-mono text-purple-400">
                4:5
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <RectangleVertical className="w-3 h-3 text-purple-400" />
              <span className="text-[10px] font-medium text-gray-300">Feed / Ads</span>
            </div>
          </div>
        </div>

        {/* Framing Anchor Indicator / Shortcut */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-white/10 text-xs">
          <Crosshair className="w-3.5 h-3.5 text-amber-400" />
          <div>
            <div className="text-[11px] font-medium text-gray-200">
              Anchor: {settings.anchorPoint.x}%
            </div>
            <div className="text-[10px] text-gray-400">Click canvas to re-anchor vertical crop</div>
          </div>
        </div>
      </div>
    </div>
  );
};
