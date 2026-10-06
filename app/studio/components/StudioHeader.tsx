import React from 'react';
import { Link } from 'react-router';
import {
  Video,
  Monitor,
  Mic,
  Circle,
  Square,
  Activity,
  FileVideo,
  FileText,
  ShieldCheck,
  Check,
  PictureInPicture2,
} from 'lucide-react';
import type { StudioSettings } from '../types';

interface StudioHeaderProps {
  settings: StudioSettings;
  onUpdateSettings: (updater: (prev: StudioSettings) => StudioSettings) => void;
  isRecording: boolean;
  recordingDuration: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  hasScreen: boolean;
  hasCamera: boolean;
  hasMic: boolean;
  isFloatingPipOpen: boolean;
  onToggleScreen: () => void;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onToggleFloatingPip: () => void;
  onOpenLibrary: () => void;
  onToggleScopes: () => void;
  libraryCount: number;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  settings,
  onUpdateSettings,
  isRecording,
  recordingDuration,
  onStartRecording,
  onStopRecording,
  hasScreen,
  hasCamera,
  hasMic,
  isFloatingPipOpen,
  onToggleScreen,
  onToggleCamera,
  onToggleMic,
  onToggleFloatingPip,
  onOpenLibrary,
  onToggleScopes,
  libraryCount,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="h-16 px-6 bg-[#131518] flex items-center justify-between z-30 shrink-0">
      {/* Brand & Mode */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
          title="Return to ShotOnce Home & Mobile Downloads"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#07080A] shrink-0">
            <img src="/shotonce-icon.png" alt="ShotOnce" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-[#F3F5F7] font-['Outfit']">
                ShotOnce
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-[#1C2026] text-[#E5A93C] font-mono">
                Studio
              </span>
            </div>
            <p className="text-[10px] text-[#969EAA] font-mono">
              4K 60fps · Local Engine
            </p>
          </div>
        </Link>
      </div>

      {/* Media Sources & Teleprompter Controls */}
      <div className="flex items-center gap-2">
        {/* Screen Share Source */}
        <button
          onClick={onToggleScreen}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
            hasScreen
              ? 'bg-[#1C2026] text-[#10B981] font-semibold'
              : 'bg-[#1C2026] text-[#969EAA] hover:bg-[#262B33] hover:text-[#F3F5F7]'
          }`}
          title={hasScreen ? 'Screen stream active (click to disconnect)' : 'Request screen sharing permission'}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>{hasScreen ? 'Screen Active' : 'Allow Screen'}</span>
          {hasScreen && <Check className="w-3 h-3 text-[#10B981]" />}
        </button>

        {/* Camera Source */}
        <button
          onClick={onToggleCamera}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
            hasCamera
              ? 'bg-[#1C2026] text-[#10B981] font-semibold'
              : 'bg-[#1C2026] text-[#969EAA] hover:bg-[#262B33] hover:text-[#F3F5F7]'
          }`}
          title={hasCamera ? 'Webcam active (click to disconnect)' : 'Request camera permission'}
        >
          <Video className="w-3.5 h-3.5" />
          <span>{hasCamera ? 'Camera Active' : 'Allow Camera'}</span>
          {hasCamera && <Check className="w-3 h-3 text-[#10B981]" />}
        </button>

        {/* Microphone Source */}
        <button
          onClick={onToggleMic}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
            hasMic
              ? 'bg-[#1C2026] text-[#10B981] font-semibold'
              : 'bg-[#1C2026] text-[#969EAA] hover:bg-[#262B33] hover:text-[#F3F5F7]'
          }`}
          title={hasMic ? 'Microphone active (click to mute)' : 'Request microphone permission'}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>{hasMic ? 'Mic Active' : 'Allow Mic'}</span>
          {hasMic && <Check className="w-3 h-3 text-[#10B981]" />}
        </button>

        <div className="w-px h-5 bg-[#1C2026] mx-1" />

        {/* Floating Face View PiP Popout */}
        <button
          onClick={onToggleFloatingPip}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
            isFloatingPipOpen
              ? 'bg-[#E5A93C] text-[#0D0E11] font-semibold'
              : 'bg-[#1C2026] text-[#969EAA] hover:bg-[#262B33] hover:text-[#F3F5F7]'
          }`}
          title="Float always-on-top webcam face bubble and recorder over other desktop apps"
        >
          <PictureInPicture2 className="w-3.5 h-3.5" />
          <span>{isFloatingPipOpen ? 'Face Floating' : 'Float Face PiP'}</span>
        </button>

        {/* Teleprompter HUD Toggle */}
        <button
          onClick={() =>
            onUpdateSettings((prev) => ({
              ...prev,
              teleprompterVisible: !prev.teleprompterVisible,
            }))
          }
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
            settings.teleprompterVisible
              ? 'bg-[#E5A93C] text-[#0D0E11] font-semibold'
              : 'bg-[#1C2026] text-[#969EAA] hover:bg-[#262B33] hover:text-[#F3F5F7]'
          }`}
          title="Toggle Floating Eye-Line Teleprompter HUD"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Teleprompter</span>
        </button>

        {/* Cinema Scopes HUD Toggle */}
        <button
          onClick={onToggleScopes}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
            settings.histogramEnabled || settings.zebrasEnabled
              ? 'bg-[#E5A93C] text-[#0D0E11] font-semibold'
              : 'bg-[#1C2026] text-[#969EAA] hover:bg-[#262B33] hover:text-[#F3F5F7]'
          }`}
          title="Blackmagic Cinema Suite Scopes & Zebras"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Scopes</span>
        </button>
      </div>

      {/* Recording Master Actions & Library */}
      <div className="flex items-center gap-3">
        {/* Tally Light & Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#07080A]">
          <div
            className={`w-2 h-2 rounded-full ${
              isRecording ? 'bg-[#EF4444]' : 'bg-[#5C6370]'
            }`}
          />
          <span className="font-mono text-xs font-medium tracking-wider text-[#F3F5F7]">
            {isRecording ? formatTime(recordingDuration) : 'STANDBY'}
          </span>
        </div>

        {/* Primary Record Button */}
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            className="px-4 py-2 rounded-lg font-bold text-xs tracking-wide bg-[#EF4444] hover:bg-[#DC2626] text-white flex items-center gap-2 transition-colors"
          >
            <Circle className="w-3 h-3 fill-white" />
            <span>RECORD</span>
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            className="px-4 py-2 rounded-lg font-bold text-xs tracking-wide bg-[#1C2026] text-[#EF4444] hover:bg-[#262B33] flex items-center gap-2 transition-colors"
          >
            <Square className="w-3 h-3 fill-[#EF4444]" />
            <span>STOP TAKE</span>
          </button>
        )}

        {/* Capture Library Button */}
        <button
          onClick={onOpenLibrary}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1C2026] hover:bg-[#262B33] text-[#969EAA] hover:text-[#F3F5F7] flex items-center gap-1.5 transition-colors"
          title="Open Capture Library & Past Takes"
        >
          <FileVideo className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span>Library</span>
          {libraryCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#E5A93C] text-[#0D0E11] font-bold">
              {libraryCount}
            </span>
          )}
        </button>

        {/* Privacy Policy Link */}
        <Link
          to="/privacy"
          className="p-2 rounded-lg text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#1C2026] transition-colors"
          title="Privacy Policy (100% Client-Side)"
        >
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
        </Link>
      </div>
    </header>
  );
};
