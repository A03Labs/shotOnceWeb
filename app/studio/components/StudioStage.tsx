import React, { useState } from 'react';
import {
  ZoomIn,
  Monitor,
  Video,
  Mic,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowRight,
  ArrowUpDown,
  ArrowLeftRight,
} from 'lucide-react';
import type { CameraLayout, StudioSettings } from '../types';

interface StudioStageProps {
  settings: StudioSettings;
  onUpdateSettings: (updater: (prev: StudioSettings) => StudioSettings) => void;
  masterCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  hasScreen: boolean;
  hasCamera: boolean;
  hasMic: boolean;
  isRequestingPermissions: boolean;
  onToggleScreen: () => Promise<void>;
  onToggleCamera: () => Promise<void>;
  onToggleMic: () => Promise<void>;
  onGrantAllPermissions: () => Promise<void>;
}

export const StudioStage: React.FC<StudioStageProps> = ({
  settings,
  onUpdateSettings,
  masterCanvasRef,
  hasScreen,
  hasCamera,
  hasMic,
  isRequestingPermissions,
  onToggleScreen,
  onToggleCamera,
  onToggleMic,
  onGrantAllPermissions,
}) => {
  const [dismissGate, setDismissGate] = useState(false);
  const showPermissionsGate = !hasScreen && !dismissGate;

  const isSplit = settings.cameraLayout.startsWith('split-');

  const handleSwapSplit = () => {
    onUpdateSettings((prev) => {
      let next = prev.cameraLayout;
      if (next === 'split-top') next = 'split-bottom';
      else if (next === 'split-bottom') next = 'split-top';
      else if (next === 'split-left') next = 'split-right';
      else if (next === 'split-right') next = 'split-left';
      return { ...prev, cameraLayout: next };
    });
  };

  return (
    <div className="flex-1 bg-[#07080A] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Top Floating Controls for Stage */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-2">
        {/* Split & Layout Quick Selector */}
        <div className="flex items-center gap-1 bg-[#131518] p-1 rounded-xl">
          <button
            onClick={() =>
              onUpdateSettings((prev) => ({
                ...prev,
                cameraLayout: prev.cameraLayout === 'split-top' ? 'split-bottom' : 'split-top',
              }))
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              settings.cameraLayout === 'split-top' || settings.cameraLayout === 'split-bottom'
                ? 'bg-[#E5A93C] text-[#0D0E11]'
                : 'text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#1C2026]'
            }`}
            title="Split view stacked: Top & Bottom"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>
              {settings.cameraLayout === 'split-bottom' ? 'Top Cam · Bottom Screen' : 'Split Top/Bottom'}
            </span>
          </button>

          <button
            onClick={() =>
              onUpdateSettings((prev) => ({
                ...prev,
                cameraLayout: prev.cameraLayout === 'split-left' ? 'split-right' : 'split-left',
              }))
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              settings.cameraLayout === 'split-left' || settings.cameraLayout === 'split-right'
                ? 'bg-[#E5A93C] text-[#0D0E11]'
                : 'text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#1C2026]'
            }`}
            title="Split view side-by-side: Left & Right"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>
              {settings.cameraLayout === 'split-right' ? 'Left Cam · Right Screen' : 'Split Left/Right'}
            </span>
          </button>

          <button
            onClick={() =>
              onUpdateSettings((prev) => ({
                ...prev,
                cameraLayout: 'circle',
              }))
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              settings.cameraLayout === 'circle' || settings.cameraLayout === 'rounded-pip'
                ? 'bg-[#E5A93C] text-[#0D0E11]'
                : 'text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#1C2026]'
            }`}
            title="Picture-in-Picture Bubble"
          >
            <span>PiP Bubble</span>
          </button>

          {isSplit && (
            <button
              onClick={handleSwapSplit}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#1C2026] text-[#E5A93C] hover:bg-[#262B33] transition-colors flex items-center gap-1"
              title="Swap camera and screen positions"
            >
              <span>Swap ⇄</span>
            </button>
          )}
        </div>

        {settings.zoomLevel > 1.0 && (
          <div className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#E5A93C] text-[#0D0E11] flex items-center gap-1">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>ZOOM {settings.zoomLevel}x</span>
          </div>
        )}

        {/* Live Source Status Telemetry */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#131518] text-xs font-mono">
          <span
            className={`w-2 h-2 rounded-full ${hasScreen ? 'bg-[#10B981]' : 'bg-[#5C6370]'}`}
          />
          <span className="text-[#969EAA]">Screen:</span>
          <span className={hasScreen ? 'text-[#F3F5F7]' : 'text-[#5C6370]'}>
            {hasScreen ? 'Active 60fps' : 'Pending'}
          </span>
          <span className="text-[#5C6370] mx-1">·</span>
          <span
            className={`w-2 h-2 rounded-full ${hasCamera ? 'bg-[#10B981]' : 'bg-[#5C6370]'}`}
          />
          <span className="text-[#969EAA]">Cam:</span>
          <span className={hasCamera ? 'text-[#F3F5F7]' : 'text-[#5C6370]'}>
            {hasCamera ? 'Active' : 'Off'}
          </span>
          <span className="text-[#5C6370] mx-1">·</span>
          <span
            className={`w-2 h-2 rounded-full ${hasMic ? 'bg-[#10B981]' : 'bg-[#5C6370]'}`}
          />
          <span className="text-[#969EAA]">Mic:</span>
          <span className={hasMic ? 'text-[#F3F5F7]' : 'text-[#5C6370]'}>
            {hasMic ? 'Active' : 'Off'}
          </span>
        </div>

        {/* Gate Reopen button if dismissed */}
        {dismissGate && !hasScreen && (
          <button
            onClick={() => setDismissGate(false)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#E5A93C] text-[#0D0E11] hover:bg-[#D4982B] transition-colors"
          >
            Grant Permissions
          </button>
        )}
      </div>

      {/* Main 16:9 Master Canvas Deck */}
      <div
        className="relative max-w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center bg-[#07080A]"
        style={{
          width: 'min(92vw - 340px, 1100px)',
        }}
      >
        <canvas
          ref={masterCanvasRef}
          width={1920}
          height={1080}
          className="w-full h-full object-contain block bg-black"
        />

        {/* Permissions Request Gate Overlay (when screen is not yet active) */}
        {showPermissionsGate && (
          <div className="absolute inset-0 bg-[#07080A]/92 backdrop-blur-sm flex items-center justify-center p-6 z-30">
            <div className="bg-[#131518] rounded-2xl p-7 max-w-lg w-full text-left">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#E5A93C] uppercase tracking-wider font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>100% Client-Side Sandbox</span>
                </div>
                <span className="text-[11px] font-mono text-[#969EAA] bg-[#1C2026] px-2 py-0.5 rounded">
                  Local Capture
                </span>
              </div>

              {/* Title & Explanation */}
              <h2 className="text-xl font-bold text-[#F3F5F7] tracking-tight font-['Outfit'] mt-3">
                Allow Studio Permissions
              </h2>
              <p className="text-xs text-[#969EAA] mt-1.5 leading-relaxed">
                ShotOnce needs browser access to your display and hardware to composite split screen and 60fps recordings. No data ever leaves your device.
              </p>

              {/* Permissions Checklist Rows */}
              <div className="mt-5 space-y-2.5">
                {/* 1. Screen Capture */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1C2026]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#262B33] flex items-center justify-center shrink-0">
                      <Monitor className={`w-4 h-4 ${hasScreen ? 'text-[#10B981]' : 'text-[#E5A93C]'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#F3F5F7]">Screen Sharing</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#262B33] text-[#E5A93C]">
                          Required
                        </span>
                      </div>
                      <p className="text-[11px] text-[#969EAA]">
                        Captures your full display, window, or browser tab
                      </p>
                    </div>
                  </div>

                  {hasScreen ? (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#10B981]/15 text-[#10B981] flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5" />
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={onToggleScreen}
                      disabled={isRequestingPermissions}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E5A93C] text-[#0D0E11] hover:bg-[#D4982B] transition-colors whitespace-nowrap"
                    >
                      Allow Screen
                    </button>
                  )}
                </div>

                {/* 2. Microphone Audio */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1C2026]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#262B33] flex items-center justify-center shrink-0">
                      <Mic className={`w-4 h-4 ${hasMic ? 'text-[#10B981]' : 'text-[#E5A93C]'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#F3F5F7]">Microphone Audio</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#262B33] text-[#969EAA]">
                          Voice
                        </span>
                      </div>
                      <p className="text-[11px] text-[#969EAA]">
                        High-fidelity voice audio with noise gating & dynamics
                      </p>
                    </div>
                  </div>

                  {hasMic ? (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#10B981]/15 text-[#10B981] flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5" />
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={onToggleMic}
                      disabled={isRequestingPermissions}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#262B33] text-[#F3F5F7] hover:bg-[#323842] transition-colors whitespace-nowrap"
                    >
                      Allow Mic
                    </button>
                  )}
                </div>

                {/* 3. Webcam Presenter */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1C2026]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#262B33] flex items-center justify-center shrink-0">
                      <Video className={`w-4 h-4 ${hasCamera ? 'text-[#10B981]' : 'text-[#E5A93C]'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#F3F5F7]">Webcam Camera</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#262B33] text-[#969EAA]">
                          Split / PiP
                        </span>
                      </div>
                      <p className="text-[11px] text-[#969EAA]">
                        Live presenter feed in Split View or PiP bubble
                      </p>
                    </div>
                  </div>

                  {hasCamera ? (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#10B981]/15 text-[#10B981] flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5" />
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={onToggleCamera}
                      disabled={isRequestingPermissions}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#262B33] text-[#F3F5F7] hover:bg-[#323842] transition-colors whitespace-nowrap"
                    >
                      Allow Cam
                    </button>
                  )}
                </div>
              </div>

              {/* Master Allow All Action */}
              <div className="mt-5 pt-4 flex items-center gap-3">
                <button
                  onClick={onGrantAllPermissions}
                  disabled={isRequestingPermissions}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide bg-[#E5A93C] text-[#0D0E11] hover:bg-[#D4982B] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isRequestingPermissions ? 'Requesting Permissions…' : 'Allow All Required Permissions'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setDismissGate(true)}
                  className="py-2.5 px-3 rounded-xl text-xs font-medium bg-[#1C2026] text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#262B33] transition-colors"
                  title="Preview blank canvas and configure backdrop without sharing screen"
                >
                  Preview Canvas
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas footer tip */}
      <div className="mt-3 text-center text-xs text-[#5C6370] flex items-center gap-2">
        <span>Dual-Source Split Screen Recording · 60fps Native Local Engine.</span>
        <span>•</span>
        <span>100% private in browser.</span>
      </div>
    </div>
  );
};
