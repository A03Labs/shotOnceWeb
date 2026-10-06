import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Square, Mic, MicOff, VideoOff, Circle } from 'lucide-react';

interface FloatingFacePipProps {
  pipWindow: Window | null;
  cameraStream: MediaStream | null;
  hasCamera: boolean;
  hasMic: boolean;
  isRecording: boolean;
  recordingDuration: number;
  isMirrored: boolean;
  onStopRecording: () => void;
  onStartRecording: () => void;
  onToggleMic: () => void;
  onClosePip: () => void;
}

export const FloatingFacePip: React.FC<FloatingFacePipProps> = ({
  pipWindow,
  cameraStream,
  hasCamera,
  hasMic,
  isRecording,
  recordingDuration,
  isMirrored,
  onStopRecording,
  onStartRecording,
  onToggleMic,
  onClosePip,
}) => {
  const pipVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimerRef = useRef<number | null>(null);

  // Sync camera stream to PiP video element
  useEffect(() => {
    if (!pipWindow || !pipVideoRef.current) return;
    if (cameraStream && hasCamera) {
      pipVideoRef.current.srcObject = cameraStream;
      pipVideoRef.current.play().catch(console.warn);
    } else {
      pipVideoRef.current.srcObject = null;
    }
  }, [pipWindow, cameraStream, hasCamera]);

  // Auto-hide controls when recording unless user hovers
  const handleMouseMove = () => {
    setIsHovered(true);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (isRecording) {
      hoverTimerRef.current = window.setTimeout(() => {
        setIsHovered(false);
      }, 2000);
    }
  };

  const handleMouseLeave = () => {
    if (isRecording) {
      setIsHovered(false);
    }
  };

  useEffect(() => {
    if (!isRecording) {
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  }, [isRecording]);

  if (!pipWindow) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Controls are visible when not recording, or when user hovers while recording
  const showControls = !isRecording || isHovered;

  return createPortal(
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: '#07080A',
        color: '#F3F5F7',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: showControls && !isRecording ? '10px' : '0px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: 'none',
        margin: 0,
        position: 'relative',
        transition: 'padding 0.2s ease',
      }}
    >
      {/* Live Presenter Face View (Full Bleed Clean Bubble) */}
      <div
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: showControls && !isRecording ? '16px' : '0px',
          overflow: 'hidden',
          background: '#0D0E11',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-radius 0.2s ease',
        }}
      >
        {hasCamera && cameraStream ? (
          <video
            ref={pipVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isMirrored ? 'scaleX(-1)' : 'none',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#969EAA',
              gap: '6px',
            }}
          >
            <VideoOff style={{ width: '26px', height: '26px', opacity: 0.6 }} />
            <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>Camera Inactive</span>
          </div>
        )}

        {/* Live Recording Telemetry Badge (Fades out when recording unless hovered) */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(7, 8, 10, 0.82)',
            padding: '4px 8px',
            borderRadius: '8px',
            backdropFilter: 'blur(8px)',
            opacity: showControls ? 1 : 0,
            pointerEvents: showControls ? 'auto' : 'none',
            transform: showControls ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isRecording ? '#EF4444' : '#5C6370',
              boxShadow: isRecording ? '0 0 6px #EF4444' : 'none',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
              color: '#F3F5F7',
              letterSpacing: '0.04em',
            }}
          >
            {isRecording ? formatTime(recordingDuration) : 'STANDBY'}
          </span>
        </div>

        {/* Brand Badge (Fades out when recording) */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            fontSize: '9px',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#E5A93C',
            background: 'rgba(7, 8, 10, 0.75)',
            padding: '3px 6px',
            borderRadius: '6px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            opacity: showControls ? 1 : 0,
            pointerEvents: 'none',
            transition: 'opacity 0.25s ease',
          }}
        >
          ShotOnce
        </div>

        {/* Bottom Floating Controls Overlay (Fades out completely during recording to keep video clean) */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: showControls ? 1 : 0,
            pointerEvents: showControls ? 'auto' : 'none',
            transform: showControls ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
        >
          {/* Mic Toggle Button */}
          <button
            onClick={onToggleMic}
            title={hasMic ? 'Mute Microphone' : 'Enable Microphone'}
            style={{
              background: 'rgba(28, 32, 38, 0.92)',
              color: hasMic ? '#10B981' : '#969EAA',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600,
              outline: 'none',
              backdropFilter: 'blur(8px)',
            }}
          >
            {hasMic ? (
              <Mic style={{ width: '13px', height: '13px' }} />
            ) : (
              <MicOff style={{ width: '13px', height: '13px' }} />
            )}
            <span>{hasMic ? 'Mic On' : 'Muted'}</span>
          </button>

          {/* Stop / Record Action Button */}
          {isRecording ? (
            <button
              onClick={onStopRecording}
              style={{
                flex: 1,
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                outline: 'none',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.35)',
              }}
            >
              <Square style={{ width: '11px', height: '11px', fill: '#FFFFFF' }} />
              <span>STOP TAKE</span>
            </button>
          ) : (
            <button
              onClick={onStartRecording}
              style={{
                flex: 1,
                background: '#E5A93C',
                color: '#0D0E11',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                outline: 'none',
              }}
            >
              <Circle style={{ width: '11px', height: '11px', fill: '#0D0E11' }} />
              <span>RECORD</span>
            </button>
          )}
        </div>
      </div>
    </div>,
    pipWindow.document.body
  );
};
