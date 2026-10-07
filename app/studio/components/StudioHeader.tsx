import React from 'react';
import { Link } from 'react-router';
import {
  Circle,
  Square,
  ShieldCheck,
  Rows,
  Columns,
  ArrowLeftRight,
  Layers,
  AlignLeft,
  AlignRight,
} from 'lucide-react';
import type { CameraLayout, StudioSettings } from '../types';

interface StudioHeaderProps {
  settings: StudioSettings;
  onUpdateSettings: (updater: (prev: StudioSettings) => StudioSettings) => void;
  isRecording: boolean;
  recordingDuration: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  settings,
  onUpdateSettings,
  isRecording,
  recordingDuration,
  onStartRecording,
  onStopRecording,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const secsRem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${secsRem.toString().padStart(2, '0')}`;
  };

  const isSplit = settings.cameraLayout.startsWith('split-');
  const isFloating = settings.cameraLayout.startsWith('float-');

  // Floating shape and side
  const floatingShape: 'round' | 'square' = settings.cameraLayout.includes('square') ? 'square' : 'round';
  const floatingSide: 'left' | 'right' = settings.cameraLayout.includes('left') ? 'left' : 'right';

  const handleSwap = () => {
    onUpdateSettings((prev) => {
      let next = prev.cameraLayout;
      if (next === 'split-top') next = 'split-bottom';
      else if (next === 'split-bottom') next = 'split-top';
      else if (next === 'split-left') next = 'split-right';
      else if (next === 'split-right') next = 'split-left';
      return { ...prev, cameraLayout: next };
    });
  };

  const setFloatingLayout = (shape: 'round' | 'square', side: 'left' | 'right') => {
    const next: CameraLayout = `float-${shape}-${side}` as CameraLayout;
    onUpdateSettings((prev) => ({ ...prev, cameraLayout: next }));
  };

  return (
    <header className="h-16 px-6 bg-[#07080A] flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
          title="Return to ShotOnce Home"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#131518] shrink-0">
            <img src="/shotonce-icon.png" alt="ShotOnce" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-[#F3F5F7] font-['Outfit']">
              ShotOnce
            </span>
            <span className="text-[10px] text-[#969EAA] font-mono ml-2">Studio</span>
          </div>
        </Link>
      </div>

      {/* Layout Mode Control Center (Centered) */}
      <div className="flex items-center gap-2">
        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-[#131518] p-1 rounded-xl">
          <button
            onClick={() => {
              if (!isSplit) {
                onUpdateSettings((prev) => ({ ...prev, cameraLayout: 'split-top' }));
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSplit
                ? 'bg-[#E5A93C] text-[#0D0E11]'
                : 'text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#1C2026]'
            }`}
          >
            <Rows className="w-3.5 h-3.5" />
            <span>50/50 Split</span>
          </button>

          <button
            onClick={() => {
              if (!isFloating) {
                onUpdateSettings((prev) => ({ ...prev, cameraLayout: 'float-round-right' }));
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isFloating
                ? 'bg-[#E5A93C] text-[#0D0E11]'
                : 'text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#1C2026]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full Screen + Floating</span>
          </button>
        </div>

        {/* Sub-Controls for Split Mode */}
        {isSplit && (
          <div className="flex items-center gap-1 bg-[#131518] p-1 rounded-xl">
            <button
              onClick={() =>
                onUpdateSettings((prev) => ({
                  ...prev,
                  cameraLayout: prev.cameraLayout === 'split-bottom' ? 'split-bottom' : 'split-top',
                }))
              }
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                settings.cameraLayout === 'split-top' || settings.cameraLayout === 'split-bottom'
                  ? 'bg-[#1C2026] text-[#E5A93C] font-semibold'
                  : 'text-[#969EAA] hover:text-[#F3F5F7]'
              }`}
              title="Top & Bottom Split"
            >
              Top/Bottom
            </button>

            <button
              onClick={() =>
                onUpdateSettings((prev) => ({
                  ...prev,
                  cameraLayout: prev.cameraLayout === 'split-right' ? 'split-right' : 'split-left',
                }))
              }
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                settings.cameraLayout === 'split-left' || settings.cameraLayout === 'split-right'
                  ? 'bg-[#1C2026] text-[#E5A93C] font-semibold'
                  : 'text-[#969EAA] hover:text-[#F3F5F7]'
              }`}
              title="Left & Right Side Split"
            >
              Left/Right
            </button>

            <button
              onClick={handleSwap}
              className="px-2 py-1.5 rounded-lg text-xs font-mono font-bold text-[#E5A93C] hover:bg-[#1C2026] transition-colors flex items-center gap-1"
              title="Swap camera and screen positions"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Swap ⇄</span>
            </button>
          </div>
        )}

        {/* Sub-Controls for Floating Camera Mode */}
        {isFloating && (
          <div className="flex items-center gap-2 bg-[#131518] p-1 rounded-xl">
            {/* Shape: Round vs Square */}
            <div className="flex items-center gap-0.5 bg-[#1C2026] p-0.5 rounded-lg">
              <button
                onClick={() => setFloatingLayout('round', floatingSide)}
                className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                  floatingShape === 'round'
                    ? 'bg-[#E5A93C] text-[#0D0E11] font-semibold'
                    : 'text-[#969EAA] hover:text-[#F3F5F7]'
                }`}
                title="Round Floating Camera"
              >
                <Circle className="w-3 h-3 fill-current" />
                <span>Round</span>
              </button>

              <button
                onClick={() => setFloatingLayout('square', floatingSide)}
                className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                  floatingShape === 'square'
                    ? 'bg-[#E5A93C] text-[#0D0E11] font-semibold'
                    : 'text-[#969EAA] hover:text-[#F3F5F7]'
                }`}
                title="Square Floating Camera"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Square</span>
              </button>
            </div>

            {/* Position: Left vs Right */}
            <div className="flex items-center gap-0.5 bg-[#1C2026] p-0.5 rounded-lg">
              <button
                onClick={() => setFloatingLayout(floatingShape, 'left')}
                className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                  floatingSide === 'left'
                    ? 'bg-[#E5A93C] text-[#0D0E11] font-semibold'
                    : 'text-[#969EAA] hover:text-[#F3F5F7]'
                }`}
                title="Float on Left Side"
              >
                <AlignLeft className="w-3 h-3" />
                <span>Left</span>
              </button>

              <button
                onClick={() => setFloatingLayout(floatingShape, 'right')}
                className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                  floatingSide === 'right'
                    ? 'bg-[#E5A93C] text-[#0D0E11] font-semibold'
                    : 'text-[#969EAA] hover:text-[#F3F5F7]'
                }`}
                title="Float on Right Side"
              >
                <AlignRight className="w-3 h-3" />
                <span>Right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Record Action & Timer */}
      <div className="flex items-center gap-3">
        {/* Tally Duration */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#131518]">
          <span
            className={`w-2 h-2 rounded-full ${
              isRecording ? 'bg-[#EF4444] animate-pulse' : 'bg-[#5C6370]'
            }`}
          />
          <span className="font-mono text-xs font-semibold tracking-wider text-[#F3F5F7]">
            {isRecording ? formatTime(recordingDuration) : 'STANDBY'}
          </span>
        </div>

        {/* Primary Record Button */}
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            className="px-5 py-2 rounded-lg font-bold text-xs tracking-wide bg-[#E5A93C] hover:bg-[#FFB834] text-[#0D0E11] flex items-center gap-2 transition-colors shadow-lg shadow-[#E5A93C]/20"
          >
            <Circle className="w-3.5 h-3.5 fill-[#0D0E11]" />
            <span>RECORD</span>
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            className="px-5 py-2 rounded-lg font-bold text-xs tracking-wide bg-[#EF4444] hover:bg-[#DC2626] text-white flex items-center gap-2 transition-colors animate-pulse"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            <span>STOP</span>
          </button>
        )}

        <Link
          to="/privacy"
          className="p-2 rounded-lg text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#131518] transition-colors"
          title="Privacy Policy"
        >
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
        </Link>
      </div>
    </header>
  );
};
