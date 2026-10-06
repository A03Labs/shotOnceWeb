import React, { useState } from 'react';
import {
  Palette,
  Camera,
  Film,
  Volume2,
  Sliders,
  Sparkles,
  Upload,
  Check,
  ZoomIn,
  Move,
  Layers,
  ShieldAlert,
  Mic,
  Monitor,
  Split,
  ArrowUpDown,
  ArrowLeftRight,
} from 'lucide-react';
import { BACKDROP_PRESETS } from '../constants';
import { CINEMA_PROFILES } from '../cinema-filters';
import type { CameraLayout, CinemaLUT, DropShadowPreset, StudioSettings, WindowFrameMockup } from '../types';

interface InspectorSidebarProps {
  settings: StudioSettings;
  onUpdateSettings: (updater: (prev: StudioSettings) => StudioSettings) => void;
  audioDevices: MediaDeviceInfo[];
}

export const InspectorSidebar: React.FC<InspectorSidebarProps> = ({
  settings,
  onUpdateSettings,
  audioDevices,
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'camera' | 'cinema' | 'audio'>('style');

  const handleCustomWallpaper = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdateSettings((prev) => ({
        ...prev,
        customBackdropUrl: url,
        backdropType: 'custom',
      }));
    }
  };

  return (
    <aside className="w-80 h-full bg-[#131518] flex flex-col z-20 shrink-0">
      {/* Tab Navigation */}
      <div className="flex bg-[#07080A] p-1.5 gap-1">
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'style'
              ? 'bg-[#1C2026] text-[#E5A93C]'
              : 'text-[#969EAA] hover:text-[#F3F5F7]'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span>Style</span>
        </button>

        <button
          onClick={() => setActiveTab('camera')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'camera'
              ? 'bg-[#1C2026] text-[#E5A93C]'
              : 'text-[#969EAA] hover:text-[#F3F5F7]'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Camera</span>
        </button>

        <button
          onClick={() => setActiveTab('cinema')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'cinema'
              ? 'bg-[#1C2026] text-[#E5A93C]'
              : 'text-[#969EAA] hover:text-[#F3F5F7]'
          }`}
        >
          <Film className="w-3.5 h-3.5 text-[#14B8A6]" />
          <span>Cinema</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'audio'
              ? 'bg-[#1C2026] text-[#E5A93C]'
              : 'text-[#969EAA] hover:text-[#F3F5F7]'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Audio</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* ================= TAB 1: STYLE ================= */}
        {activeTab === 'style' && (
          <>
            {/* Backdrop Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Cap.so Backdrop Canvas
                </label>
                <label className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer">
                  <Upload className="w-3 h-3" />
                  <span>Custom Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomWallpaper}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {BACKDROP_PRESETS.map((p) => {
                  const isSelected =
                    settings.backdropPreset === p.id && !settings.customBackdropUrl;
                  return (
                    <button
                      key={p.id}
                      onClick={() =>
                        onUpdateSettings((prev) => ({
                          ...prev,
                          backdropPreset: p.id,
                          customBackdropUrl: null,
                        }))
                      }
                      className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/15 shadow-md shadow-amber-500/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-lg shrink-0 border border-white/20"
                        style={{
                          background: p.previewColors[0]
                            ? `linear-gradient(135deg, ${p.previewColors[0]}, ${p.previewColors[1] || p.previewColors[0]})`
                            : '#07080a',
                        }}
                      />
                      <span className="text-[11px] font-medium text-gray-200 truncate">
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Window Padding */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-gray-300">Studio Padding</span>
                <span className="text-xs font-mono text-amber-400">{settings.padding}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="4"
                value={settings.padding}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({ ...prev, padding: parseInt(e.target.value) }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>Edge-to-Edge (0px)</span>
                <span>Max Studio (120px)</span>
              </div>
            </div>

            {/* Corner Radius */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-gray-300">Corner Radius</span>
                <span className="text-xs font-mono text-amber-400">{settings.cornerRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                step="2"
                value={settings.cornerRadius}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    cornerRadius: parseInt(e.target.value),
                  }))
                }
                className="w-full"
              />
            </div>

            {/* Drop Shadow Preset */}
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-2">
                Drop Shadow & Depth
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'none', label: 'None' },
                    { id: 'soft', label: 'Soft Studio' },
                    { id: 'bold', label: 'Bold Ambient' },
                    { id: 'amber-glow', label: 'Amber Glow' },
                  ] as { id: DropShadowPreset; label: string }[]
                ).map((s) => (
                  <button
                    key={s.id}
                    onClick={() =>
                      onUpdateSettings((prev) => ({ ...prev, shadowPreset: s.id }))
                    }
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      settings.shadowPreset === s.id
                        ? 'border-amber-500 bg-amber-500/15 text-white'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Window Mockup Chrome */}
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-2">
                Window Frame Mockup
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'macos', label: 'macOS' },
                    { id: 'browser', label: 'Browser' },
                    { id: 'borderless', label: 'Clean' },
                  ] as { id: WindowFrameMockup; label: string }[]
                ).map((f) => (
                  <button
                    key={f.id}
                    onClick={() =>
                      onUpdateSettings((prev) => ({ ...prev, windowFrame: f.id }))
                    }
                    className={`py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                      settings.windowFrame === f.id
                        ? 'border-amber-500 bg-amber-500/15 text-white'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ================= TAB 2: CAMERA & ZOOM ================= */}
        {activeTab === 'camera' && (
          <>
            {/* Split Screen Layouts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#F3F5F7]">
                  Split Screen Layouts
                </label>
                {settings.cameraLayout.startsWith('split-') && (
                  <button
                    onClick={() => {
                      onUpdateSettings((prev) => {
                        let next = prev.cameraLayout;
                        if (next === 'split-top') next = 'split-bottom';
                        else if (next === 'split-bottom') next = 'split-top';
                        else if (next === 'split-left') next = 'split-right';
                        else if (next === 'split-right') next = 'split-left';
                        return { ...prev, cameraLayout: next };
                      });
                    }}
                    className="text-[11px] font-mono text-[#E5A93C] hover:text-[#FFB834] flex items-center gap-1 transition-colors"
                    title="Swap Screen and Camera positions"
                  >
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>Swap Feeds</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'split-top', label: 'Top Screen · Bottom Cam', icon: <ArrowUpDown className="w-3.5 h-3.5 text-[#E5A93C]" /> },
                  { id: 'split-bottom', label: 'Top Cam · Bottom Screen', icon: <ArrowUpDown className="w-3.5 h-3.5 text-[#10B981]" /> },
                  { id: 'split-left', label: 'Left Screen · Right Cam', icon: <ArrowLeftRight className="w-3.5 h-3.5 text-[#E5A93C]" /> },
                  { id: 'split-right', label: 'Left Cam · Right Screen', icon: <ArrowLeftRight className="w-3.5 h-3.5 text-[#10B981]" /> },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() =>
                      onUpdateSettings((prev) => ({ ...prev, cameraLayout: l.id as CameraLayout }))
                    }
                    className={`py-2 px-2 rounded-xl text-xs font-medium text-left flex items-center gap-2 transition-colors ${
                      settings.cameraLayout === l.id
                        ? 'bg-[#E5A93C] text-[#0D0E11] font-bold'
                        : 'bg-[#1C2026] text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#262B33]'
                    }`}
                  >
                    {l.icon}
                    <span className="truncate">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Picture-in-Picture & Solo Modes */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#969EAA] block mb-2">
                PiP &amp; Solo Modes
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'circle', label: 'Circle Bubble' },
                  { id: 'rounded-pip', label: 'Rounded PiP' },
                  { id: 'hidden', label: 'Screen Only' },
                  { id: 'fullscreen', label: 'Camera Only' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() =>
                      onUpdateSettings((prev) => ({ ...prev, cameraLayout: l.id as CameraLayout }))
                    }
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium text-center transition-colors ${
                      settings.cameraLayout === l.id
                        ? 'bg-[#E5A93C] text-[#0D0E11] font-bold'
                        : 'bg-[#1C2026] text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#262B33]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Camera Scale (when in PiP mode) */}
            {(settings.cameraLayout === 'circle' || settings.cameraLayout === 'rounded-pip') && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-[#969EAA]">Camera Bubble Scale</span>
                  <span className="text-xs font-mono text-[#E5A93C]">{settings.cameraScale}%</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="45"
                  step="1"
                  value={settings.cameraScale}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      cameraScale: parseInt(e.target.value),
                    }))
                  }
                  className="w-full accent-[#E5A93C]"
                />
              </div>
            )}

            {/* Camera Position Presets */}
            {settings.cameraLayout === 'circle' && (
              <div>
                <label className="text-xs font-medium text-gray-300 block mb-2">
                  Docking Position
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Top-Left', x: 8, y: 8 },
                    { label: 'Top-Right', x: 82, y: 8 },
                    { label: 'Center', x: 45, y: 45 },
                    { label: 'Bottom-Left', x: 8, y: 78 },
                    { label: 'Bottom-Right', x: 82, y: 78 },
                  ].map((pos) => {
                    const isCurrent =
                      Math.abs(settings.cameraPosition.x - pos.x) < 5 &&
                      Math.abs(settings.cameraPosition.y - pos.y) < 5;
                    return (
                      <button
                        key={pos.label}
                        onClick={() =>
                          onUpdateSettings((prev) => ({
                            ...prev,
                            cameraPosition: { x: pos.x, y: pos.y },
                          }))
                        }
                        className={`py-1.5 rounded-lg text-[11px] font-medium border text-center transition-all ${
                          isCurrent
                            ? 'border-emerald-500 bg-emerald-500/20 text-white'
                            : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {pos.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mirror & Glow */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
                <span>Mirror Camera Video</span>
                <input
                  type="checkbox"
                  checked={settings.cameraMirrored}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      cameraMirrored: e.target.checked,
                    }))
                  }
                  className="rounded accent-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
                <span>Amber Halo Border Glow</span>
                <input
                  type="checkbox"
                  checked={settings.cameraGlow}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      cameraGlow: e.target.checked,
                    }))
                  }
                  className="rounded accent-emerald-500"
                />
              </label>
            </div>

            {/* Click-to-Zoom / Action Zoom */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Action Zoom Transitions</span>
                </span>
                <span className="text-xs font-mono text-amber-400">{settings.zoomLevel}x</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1.0, 1.5, 2.0].map((z) => (
                  <button
                    key={z}
                    onClick={() =>
                      onUpdateSettings((prev) => ({ ...prev, zoomLevel: z }))
                    }
                    className={`py-1.5 rounded-lg text-xs font-semibold border text-center transition-all ${
                      settings.zoomLevel === z
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {z.toFixed(1)}x {z === 1.0 ? '(Normal)' : '(Focus)'}
                  </button>
                ))}
              </div>
            </div>

            {/* 9:16 Focal Anchor */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-300 flex items-center gap-1">
                  <Move className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Vertical Crop Anchor (9:16)</span>
                </span>
                <span className="text-xs font-mono text-cyan-400">{settings.anchorPoint.x}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={settings.anchorPoint.x}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    anchorPoint: { ...prev.anchorPoint, x: parseInt(e.target.value) },
                  }))
                }
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>Left (Code)</span>
                <span>Center (50%)</span>
                <span>Right (Webcam)</span>
              </div>
            </div>
          </>
        )}

        {/* ================= TAB 3: CINEMA & LUTS ================= */}
        {activeTab === 'cinema' && (
          <>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-2">
                Blackmagic Cinema LUT Profiles
              </label>
              <div className="space-y-2">
                {Object.values(CINEMA_PROFILES).map((prof) => {
                  const isSelected = settings.cinemaLut === prof.id;
                  return (
                    <div
                      key={prof.id}
                      onClick={() =>
                        onUpdateSettings((prev) => ({ ...prev, cinemaLut: prof.id }))
                      }
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/15 shadow-md shadow-amber-500/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-white">
                          {prof.name}
                        </span>
                        <span
                          style={{ color: prof.accentColor }}
                          className="text-[10px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded border border-white/10"
                        >
                          {prof.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        {prof.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/10">
              <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
                <span>Highlight Zebras Pattern</span>
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
              </label>
            </div>
          </>
        )}

        {/* ================= TAB 4: AUDIO MIXER ================= */}
        {activeTab === 'audio' && (
          <>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-2">
                Hardware Audio Devices
              </label>
              <div className="space-y-1">
                <span className="text-[11px] text-gray-400">Microphone Input:</span>
                <select
                  value={settings.selectedMicId}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({ ...prev, selectedMicId: e.target.value }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-gray-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="default">Default System Microphone</option>
                  {audioDevices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId} className="bg-gray-900 text-white">
                      {d.label || `Microphone (${d.deviceId.slice(0, 8)})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mic Fader */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-amber-400" />
                  <span>Microphone Gain</span>
                </span>
                <span className="text-xs font-mono text-amber-400">
                  {Math.round(settings.micVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={settings.micVolume}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    micVolume: parseFloat(e.target.value),
                  }))
                }
                className="w-full"
              />
            </div>

            {/* System Audio Fader */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-blue-400" />
                  <span>System Audio Gain</span>
                </span>
                <span className="text-xs font-mono text-blue-400">
                  {Math.round(settings.systemVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={settings.systemVolume}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    systemVolume: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-blue-500"
              />
            </div>

            {/* Web Audio Dynamics Processing */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                Audio Dynamics Processing
              </span>

              <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
                <div>
                  <div className="font-medium text-white">Broadcast Compressor</div>
                  <div className="text-[10px] text-gray-400">4:1 ratio dynamic range smoothing</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.compressor}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      compressor: e.target.checked,
                    }))
                  }
                  className="rounded accent-amber-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
                <div>
                  <div className="font-medium text-white">Software Noise Gate</div>
                  <div className="text-[10px] text-gray-400">Low rumble and AC hum suppression</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.noiseGate}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      noiseGate: e.target.checked,
                    }))
                  }
                  className="rounded accent-amber-500"
                />
              </label>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
