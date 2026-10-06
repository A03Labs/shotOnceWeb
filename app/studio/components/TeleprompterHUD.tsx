import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FlipHorizontal,
  X,
  ExternalLink,
  ShieldCheck,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { TELEPROMPTER_TEMPLATES } from '../constants';
import type { StudioSettings } from '../types';

interface TeleprompterHUDProps {
  settings: StudioSettings;
  onUpdateSettings: (updater: (prev: StudioSettings) => StudioSettings) => void;
  onClose: () => void;
}

export const TeleprompterHUD: React.FC<TeleprompterHUDProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 32, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  // Auto-scroll loop
  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;
    let lastTime = performance.now();

    const scroll = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (scrollContainerRef.current) {
        const pixelsPerSecond = (settings.teleprompterSpeedWpm / 60) * 12;
        scrollContainerRef.current.scrollTop += pixelsPerSecond * delta;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 2) {
          setIsPlaying(false);
          return;
        }
      }
      animId = requestAnimationFrame(scroll);
    };

    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, settings.teleprompterSpeedWpm]);

  // Keyboard shortcut listener (Space = play/pause, Up/Down = speed)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!settings.teleprompterVisible) return;
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        onUpdateSettings((prev) => ({
          ...prev,
          teleprompterSpeedWpm: Math.min(240, prev.teleprompterSpeedWpm + 10),
        }));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        onUpdateSettings((prev) => ({
          ...prev,
          teleprompterSpeedWpm: Math.max(60, prev.teleprompterSpeedWpm - 10),
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.teleprompterVisible, onUpdateSettings]);

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 380, dragStartRef.current.posX + dx)),
        y: Math.max(60, Math.min(window.innerHeight - 300, dragStartRef.current.posY + dy)),
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const restartScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    setIsPlaying(true);
  };

  // Pop out teleprompter to an external browser window so it can sit completely outside the shared window
  const handlePopOut = () => {
    const popout = window.open(
      '',
      'ShotOnceTeleprompter',
      'width=440,height=360,menubar=no,toolbar=no,location=no,status=no'
    );
    if (!popout) return;

    popout.document.title = 'ShotOnce · Eye-Line Teleprompter';
    popout.document.body.style.background = '#07080A';
    popout.document.body.style.color = '#F3F5F7';
    popout.document.body.style.fontFamily = 'Inter, -apple-system, sans-serif';
    popout.document.body.style.margin = '0';
    popout.document.body.style.padding = '16px';
    popout.document.body.style.boxSizing = 'border-box';

    popout.document.body.innerHTML = `
      <div style="display:flex; flex-direction:column; height:100vh; overflow:hidden;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; font-family:monospace; font-size:11px; color:#E5A93C;">
          <span>🔒 PRIVATE EYE-LINE PROMPTER</span>
          <span style="color:#969EAA;">NOT RECORDED IN VIDEO</span>
        </div>
        <div id="scroller" style="flex:1; overflow-y:auto; font-size:18px; line-height:1.6; color:#F3F5F7; padding:12px; background:#131518; border-radius:12px; white-space:pre-wrap;">
          ${settings.teleprompterText}
        </div>
        <div style="margin-top:12px; display:flex; gap:8px; align-items:center;">
          <button id="playBtn" style="padding:8px 16px; background:#E5A93C; color:#0D0E11; font-weight:bold; border:none; border-radius:8px; cursor:pointer;">Play / Pause</button>
          <span style="font-size:11px; font-family:monospace; color:#969EAA;">Speed: ${settings.teleprompterSpeedWpm} WPM</span>
        </div>
      </div>
    `;

    let active = true;
    let scrolling = false;
    const scroller = popout.document.getElementById('scroller');
    const playBtn = popout.document.getElementById('playBtn');

    if (playBtn && scroller) {
      playBtn.onclick = () => {
        scrolling = !scrolling;
        playBtn.innerText = scrolling ? 'Pause' : 'Play';
      };

      const step = () => {
        if (!active) return;
        if (scrolling && scroller) {
          scroller.scrollTop += (settings.teleprompterSpeedWpm / 60) * 0.25;
        }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    popout.onbeforeunload = () => {
      active = false;
    };
  };

  return (
    <div
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className="absolute z-40 w-96 rounded-2xl bg-[#131518] shadow-2xl flex flex-col overflow-hidden select-none"
    >
      {/* HUD Header */}
      <div
        onMouseDown={handleMouseDown}
        className="px-4 py-3 bg-[#1C2026] flex items-center justify-between cursor-move"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E5A93C] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#F3F5F7]">
            Eye-Line Teleprompter
          </span>
          <span className="text-[10px] font-mono text-[#E5A93C] bg-[#262B33] px-1.5 py-0.5 rounded">
            {settings.teleprompterSpeedWpm} WPM
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Pop-Out to external window */}
          <button
            onClick={handlePopOut}
            className="p-1 rounded text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#262B33] transition-colors"
            title="Pop out to separate window (position outside recorded screen or on 2nd monitor)"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Minimize / Expand Toggle */}
          <button
            onClick={() => setIsCollapsed((c) => !c)}
            className="p-1 rounded text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#262B33] transition-colors"
            title={isCollapsed ? 'Expand teleprompter' : 'Collapse to compact bar'}
          >
            {isCollapsed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close HUD */}
          <button
            onClick={onClose}
            className="p-1 rounded text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#262B33] transition-colors"
            title="Close Teleprompter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Private Eye-Line Guarantee Badge */}
      <div className="px-4 py-1.5 bg-[#07080A] flex items-center justify-between text-[11px] font-mono text-[#10B981]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Private Eye-Line · Excluded From Video</span>
        </div>
        <span className="text-[10px] text-[#5C6370]">Presenter Only</span>
      </div>

      {!isCollapsed && (
        <>
          {/* Script Selector Quick Dropdown */}
          <div className="px-4 py-2 bg-[#131518] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#969EAA]">Template:</span>
            <select
              onChange={(e) => {
                const t = TELEPROMPTER_TEMPLATES.find((x) => x.id === e.target.value);
                if (t) {
                  onUpdateSettings((prev) => ({ ...prev, teleprompterText: t.content }));
                  if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
                }
              }}
              className="bg-[#1C2026] text-[#E5A93C] text-[11px] rounded-lg px-2.5 py-1 focus:outline-none"
            >
              {TELEPROMPTER_TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id} className="bg-[#131518] text-[#F3F5F7]">
                  {tmpl.title} ({tmpl.category})
                </option>
              ))}
            </select>
          </div>

          {/* Prompter Scrolling Area */}
          <div
            ref={scrollContainerRef}
            style={{
              transform: settings.teleprompterMirrored ? 'scaleX(-1)' : 'none',
              fontSize: `${settings.teleprompterFontSize}px`,
            }}
            className="h-52 px-5 py-3 overflow-y-auto text-[#F3F5F7] font-sans leading-relaxed tracking-normal transition-all"
          >
            <div className="h-4" />
            <div className="whitespace-pre-wrap font-medium text-[#F3F5F7]">
              {settings.teleprompterText}
            </div>
            <div className="h-24" />
          </div>

          {/* Eyeline Focus Marker */}
          <div className="h-0.5 w-full bg-[#E5A93C]/40" />

          {/* Bottom Controls Deck */}
          <div className="p-3 bg-[#1C2026] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                  isPlaying
                    ? 'bg-[#E5A93C] text-[#0D0E11]'
                    : 'bg-[#262B33] text-[#F3F5F7] hover:bg-[#323842]'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-[#0D0E11]" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-[#F3F5F7]" />
                    <span>Scroll [Space]</span>
                  </>
                )}
              </button>

              <button
                onClick={restartScroll}
                className="p-1.5 rounded-lg bg-[#262B33] text-[#969EAA] hover:text-[#F3F5F7] transition-colors"
                title="Restart to top"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speed & Mirroring Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#969EAA]">Speed:</span>
                <input
                  type="range"
                  min="80"
                  max="220"
                  step="5"
                  value={settings.teleprompterSpeedWpm}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      teleprompterSpeedWpm: parseInt(e.target.value),
                    }))
                  }
                  className="w-16 accent-[#E5A93C]"
                />
              </div>

              <button
                onClick={() =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    teleprompterMirrored: !prev.teleprompterMirrored,
                  }))
                }
                className={`p-1.5 rounded-lg transition-colors ${
                  settings.teleprompterMirrored
                    ? 'bg-[#E5A93C]/20 text-[#E5A93C]'
                    : 'bg-[#262B33] text-[#969EAA] hover:text-[#F3F5F7]'
                }`}
                title="Mirror for optical beam-splitter glass"
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
