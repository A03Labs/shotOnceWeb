import React, { useState } from 'react';
import {
  Monitor,
  Video,
  Mic,
  MicOff,
  Check,
  Sparkles,
  ArrowRight,
  PictureInPicture2,
  FlipHorizontal,
} from 'lucide-react';
import type { StudioSettings } from '../types';

interface StudioStageProps {
  settings: StudioSettings;
  onUpdateSettings: (updater: (prev: StudioSettings) => StudioSettings) => void;
  masterCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  hasScreen: boolean;
  hasCamera: boolean;
  hasMic: boolean;
  isFloatingPipOpen: boolean;
  isRequestingPermissions: boolean;
  onToggleScreen: () => Promise<void>;
  onToggleCamera: () => Promise<void>;
  onToggleMic: () => Promise<void>;
  onToggleFloatingPip: () => void;
  onGrantAllPermissions: () => Promise<void>;
}

export const StudioStage: React.FC<StudioStageProps> = ({
  settings,
  onUpdateSettings,
  masterCanvasRef,
  hasScreen,
  hasCamera,
  hasMic,
  isFloatingPipOpen,
  isRequestingPermissions,
  onToggleScreen,
  onToggleCamera,
  onToggleMic,
  onToggleFloatingPip,
  onGrantAllPermissions,
}) => {
  const [dismissGate, setDismissGate] = useState(false);
  const showPermissionsGate = (!hasScreen || !hasCamera) && !dismissGate;

  return (
    <div className="flex-1 bg-[#07080A] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Main 16:9 Master Canvas Deck */}
      <div
        className="relative max-w-full aspect-video rounded-2xl overflow-hidden flex items-center justify-center bg-[#07080A] shadow-2xl"
        style={{
          width: 'min(94vw, 1360px)',
          maxHeight: 'calc(100vh - 160px)',
        }}
      >
        <canvas
          ref={masterCanvasRef}
          width={1920}
          height={1080}
          className="w-full h-full object-contain block bg-[#07080A]"
        />

        {/* Permissions Request Gate Overlay (when screen or camera is not yet active) */}
        {showPermissionsGate && (
          <div className="absolute inset-0 bg-[#07080A]/85 backdrop-blur-md flex items-center justify-center p-6 z-30">
            <div className="bg-[#131518] rounded-2xl p-7 max-w-md w-full text-left shadow-2xl">
              <h2 className="text-xl font-bold text-[#F3F5F7] tracking-tight font-['Outfit']">
                Start Recording
              </h2>
              <p className="text-xs text-[#969EAA] mt-1.5 leading-relaxed">
                Share your screen and camera to composite both feeds simultaneously in real time. All processing runs locally on your device.
              </p>

              {/* Quick source status */}
              <div className="mt-5 space-y-2.5">
                {/* 1. Screen Capture */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1C2026]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#262B33] flex items-center justify-center shrink-0">
                      <Monitor className={`w-4 h-4 ${hasScreen ? 'text-[#10B981]' : 'text-[#E5A93C]'}`} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#F3F5F7]">Screen Sharing</span>
                      <p className="text-[11px] text-[#969EAA]">Select an app window or screen</p>
                    </div>
                  </div>

                  {hasScreen ? (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#10B981]/15 text-[#10B981] flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5" />
                      Ready
                    </span>
                  ) : (
                    <button
                      onClick={onToggleScreen}
                      disabled={isRequestingPermissions}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E5A93C] text-[#0D0E11] hover:bg-[#FFB834] transition-colors"
                    >
                      Share Screen
                    </button>
                  )}
                </div>

                {/* 2. Camera */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1C2026]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#262B33] flex items-center justify-center shrink-0">
                      <Video className={`w-4 h-4 ${hasCamera ? 'text-[#10B981]' : 'text-[#E5A93C]'}`} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#F3F5F7]">Camera Feed</span>
                      <p className="text-[11px] text-[#969EAA]">Shows your face alongside screen</p>
                    </div>
                  </div>

                  {hasCamera ? (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#10B981]/15 text-[#10B981] flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5" />
                      Ready
                    </span>
                  ) : (
                    <button
                      onClick={onToggleCamera}
                      disabled={isRequestingPermissions}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#262B33] text-[#F3F5F7] hover:bg-[#323842] transition-colors"
                    >
                      Turn On Cam
                    </button>
                  )}
                </div>

                {/* 3. Mic */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1C2026]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#262B33] flex items-center justify-center shrink-0">
                      <Mic className={`w-4 h-4 ${hasMic ? 'text-[#10B981]' : 'text-[#969EAA]'}`} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#F3F5F7]">Microphone</span>
                      <p className="text-[11px] text-[#969EAA]">Voice narration track</p>
                    </div>
                  </div>

                  {hasMic ? (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#10B981]/15 text-[#10B981] flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5" />
                      Ready
                    </span>
                  ) : (
                    <button
                      onClick={onToggleMic}
                      disabled={isRequestingPermissions}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#262B33] text-[#F3F5F7] hover:bg-[#323842] transition-colors"
                    >
                      Enable Mic
                    </button>
                  )}
                </div>
              </div>

              {/* Master Allow All Action */}
              <div className="mt-5 pt-4 flex items-center gap-3">
                <button
                  onClick={onGrantAllPermissions}
                  disabled={isRequestingPermissions}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-[#E5A93C] text-[#0D0E11] hover:bg-[#FFB834] transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isRequestingPermissions ? 'Connecting…' : 'Enable Screen, Cam & Mic'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setDismissGate(true)}
                  className="py-3 px-3 rounded-xl text-xs font-medium bg-[#1C2026] text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#262B33] transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Instrument Toolbar */}
      <div className="mt-4 flex items-center gap-2 bg-[#131518] px-3 py-2 rounded-2xl shadow-xl z-20">
        {/* Screen Toggle */}
        <button
          onClick={onToggleScreen}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
            hasScreen
              ? 'bg-[#1C2026] text-[#10B981]'
              : 'bg-[#1C2026] text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#262B33]'
          }`}
          title={hasScreen ? 'Screen active (click to disconnect)' : 'Share screen'}
        >
          <Monitor className="w-4 h-4" />
          <span>{hasScreen ? 'Screen Active' : 'Share Screen'}</span>
          {hasScreen && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />}
        </button>

        {/* Camera Toggle */}
        <button
          onClick={onToggleCamera}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
            hasCamera
              ? 'bg-[#1C2026] text-[#10B981]'
              : 'bg-[#1C2026] text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#262B33]'
          }`}
          title={hasCamera ? 'Camera active (click to turn off)' : 'Turn on camera'}
        >
          <Video className="w-4 h-4" />
          <span>{hasCamera ? 'Camera Active' : 'Enable Camera'}</span>
          {hasCamera && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />}
        </button>

        {/* Mirror Camera Toggle */}
        {hasCamera && (
          <button
            onClick={() =>
              onUpdateSettings((prev) => ({
                ...prev,
                cameraMirrored: !prev.cameraMirrored,
              }))
            }
            className={`p-2 rounded-xl text-xs transition-colors ${
              settings.cameraMirrored
                ? 'bg-[#1C2026] text-[#E5A93C]'
                : 'bg-[#1C2026] text-[#969EAA] hover:text-[#F3F5F7]'
            }`}
            title="Mirror camera horizontal orientation"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>
        )}

        {/* Mic Toggle */}
        <button
          onClick={onToggleMic}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
            hasMic
              ? 'bg-[#1C2026] text-[#10B981]'
              : 'bg-[#1C2026] text-[#EF4444]'
          }`}
          title={hasMic ? 'Mute microphone' : 'Unmute microphone'}
        >
          {hasMic ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          <span>{hasMic ? 'Mic On' : 'Muted'}</span>
        </button>

        <div className="w-px h-5 bg-[#262B33] mx-1" />

        {/* Floating PiP Popout */}
        <button
          onClick={onToggleFloatingPip}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
            isFloatingPipOpen
              ? 'bg-[#E5A93C] text-[#0D0E11]'
              : 'bg-[#1C2026] text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#262B33]'
          }`}
          title="Float face view in an always-on-top window over other apps"
        >
          <PictureInPicture2 className="w-4 h-4" />
          <span>{isFloatingPipOpen ? 'Floating PiP On' : 'Float Face PiP'}</span>
        </button>
      </div>
    </div>
  );
};
