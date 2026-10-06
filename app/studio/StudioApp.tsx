import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StudioHeader } from './components/StudioHeader';
import { StudioStage } from './components/StudioStage';
import { InspectorSidebar } from './components/InspectorSidebar';
import { TeleprompterHUD } from './components/TeleprompterHUD';
import { CinemaScopesModal } from './components/CinemaScopesModal';
import { TrimTimelineModal } from './components/TrimTimelineModal';
import { CaptureLibraryDrawer } from './components/CaptureLibraryDrawer';
import { FloatingFacePip } from './components/FloatingFacePip';
import { CanvasCompositor } from './compositor';
import { audioStudioEngine } from './audio-engine';
import { computeLuminanceHistogram } from './cinema-filters';
import { DEFAULT_STUDIO_SETTINGS } from './constants';
import { getAllTakesFromLibrary, saveTakeToLibrary, deleteTakeFromLibrary } from './storage';
import type { RecordedTake, StudioSettings } from './types';

export const StudioApp: React.FC = () => {
  const [settings, setSettings] = useState<StudioSettings>(DEFAULT_STUDIO_SETTINGS);
  const [hasScreen, setHasScreen] = useState<boolean>(false);
  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [hasMic, setHasMic] = useState<boolean>(false);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [takes, setTakes] = useState<RecordedTake[]>([]);
  const [selectedTakeForTrim, setSelectedTakeForTrim] = useState<RecordedTake | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isScopesOpen, setIsScopesOpen] = useState<boolean>(false);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [histogramBins, setHistogramBins] = useState<number[]>(new Array(16).fill(0.2));
  const [clippingPercent, setClippingPercent] = useState<number>(0);

  // Hidden Video elements for media streams
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const masterCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active Streams
  const screenStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Recording Engine State
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const recordingStartTimeRef = useRef<number>(0);

  // Canvas Compositor
  const compositorRef = useRef<CanvasCompositor>(new CanvasCompositor(1920, 1080));

  // Load past takes from IndexedDB on mount
  useEffect(() => {
    getAllTakesFromLibrary().then(setTakes).catch(console.error);

    // Enumerate audio input devices if already permitted
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const audioInputs = devices.filter((d) => d.kind === 'audioinput');
        setAudioDevices(audioInputs);
      }).catch(console.warn);
    }

    // Initialize audio engine
    audioStudioEngine.init();

    return () => {
      audioStudioEngine.cleanup();
      // Stop all tracks on unmount
      if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach((t) => t.stop());
      if (cameraStreamRef.current) cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      if (micStreamRef.current) micStreamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Sync Audio Settings with Audio Engine
  useEffect(() => {
    audioStudioEngine.setMicVolume(settings.micVolume);
    audioStudioEngine.setSystemVolume(settings.systemVolume);
    audioStudioEngine.setCompressorEnabled(settings.compressor);
    audioStudioEngine.setNoiseGateEnabled(settings.noiseGate);
  }, [settings.micVolume, settings.systemVolume, settings.compressor, settings.noiseGate]);

  // Main 60fps Canvas Compositing Loop
  useEffect(() => {
    let animId: number;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      const canvas = masterCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: false });
        if (ctx) {
          compositorRef.current.render(
            ctx,
            settings,
            screenVideoRef.current,
            cameraVideoRef.current
          );

          // Update histogram & scopes every 12 frames to preserve rendering performance
          if (frameCount % 12 === 0 && (settings.histogramEnabled || isScopesOpen)) {
            const hist = computeLuminanceHistogram(ctx, 160, 90);
            setHistogramBins(hist.bins);
            setClippingPercent(hist.clippingPercent);
          }
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [settings, isScopesOpen]);

  // Toggle Screen Capture
  const handleToggleScreen = async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
      audioStudioEngine.setSystemStream(null);
      setHasScreen(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: 60,
          displaySurface: 'monitor',
        },
        audio: true,
      });

      screenStreamRef.current = stream;
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = stream;
        screenVideoRef.current.play().catch(console.warn);
      }

      // Route system audio
      audioStudioEngine.setSystemStream(stream);
      setHasScreen(true);

      stream.getVideoTracks()[0].onended = () => {
        screenStreamRef.current = null;
        if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
        audioStudioEngine.setSystemStream(null);
        setHasScreen(false);
      };
    } catch (err) {
      console.warn('Screen share cancelled or not allowed:', err);
    }
  };

  // Toggle Camera Capture
  const handleToggleCamera = async () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current = null;
      if (cameraVideoRef.current) cameraVideoRef.current.srcObject = null;
      setHasCamera(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user',
        },
        audio: false,
      });

      cameraStreamRef.current = stream;
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        cameraVideoRef.current.play().catch(console.warn);
      }

      setHasCamera(true);
    } catch (err) {
      console.warn('Camera access cancelled or not allowed:', err);
    }
  };

  // Toggle Microphone Capture
  const handleToggleMic = async () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
      audioStudioEngine.setMicrophoneStream(null);
      setHasMic(false);
      return;
    }

    try {
      const deviceConstraint =
        settings.selectedMicId && settings.selectedMicId !== 'default'
          ? { exact: settings.selectedMicId }
          : undefined;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: deviceConstraint,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });

      micStreamRef.current = stream;
      audioStudioEngine.setMicrophoneStream(stream);
      setHasMic(true);

      if (navigator.mediaDevices?.enumerateDevices) {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          const audioInputs = devices.filter((d) => d.kind === 'audioinput');
          setAudioDevices(audioInputs);
        }).catch(console.warn);
      }
    } catch (err) {
      console.warn('Microphone permission cancelled or not allowed:', err);
    }
  };

  // Grant All Studio Permissions Flow
  const handleGrantAllPermissions = async () => {
    setIsRequestingPermissions(true);
    setPermissionError(null);

    // 1. Request Camera and Microphone
    try {
      if (!cameraStreamRef.current || !micStreamRef.current) {
        const needCam = !cameraStreamRef.current;
        const needMic = !micStreamRef.current;

        const avStream = await navigator.mediaDevices.getUserMedia({
          video: needCam
            ? {
                width: { ideal: 1920 },
                height: { ideal: 1080 },
                facingMode: 'user',
              }
            : false,
          audio: needMic
            ? {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              }
            : false,
        });

        const vTracks = avStream.getVideoTracks();
        if (vTracks.length > 0 && !cameraStreamRef.current) {
          const camStream = new MediaStream(vTracks);
          cameraStreamRef.current = camStream;
          if (cameraVideoRef.current) {
            cameraVideoRef.current.srcObject = camStream;
            cameraVideoRef.current.play().catch(console.warn);
          }
          setHasCamera(true);
        }

        const aTracks = avStream.getAudioTracks();
        if (aTracks.length > 0 && !micStreamRef.current) {
          const mStream = new MediaStream(aTracks);
          micStreamRef.current = mStream;
          audioStudioEngine.setMicrophoneStream(mStream);
          setHasMic(true);
        }

        if (navigator.mediaDevices?.enumerateDevices) {
          navigator.mediaDevices.enumerateDevices().then((devices) => {
            const audioInputs = devices.filter((d) => d.kind === 'audioinput');
            setAudioDevices(audioInputs);
          }).catch(console.warn);
        }
      }
    } catch (err) {
      console.warn('Camera/Mic permission skipped or denied:', err);
    }

    // 2. Request Screen capture
    try {
      if (!screenStreamRef.current) {
        const sStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            frameRate: 60,
            displaySurface: 'monitor',
          },
          audio: true,
        });

        screenStreamRef.current = sStream;
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = sStream;
          screenVideoRef.current.play().catch(console.warn);
        }
        audioStudioEngine.setSystemStream(sStream);
        setHasScreen(true);

        sStream.getVideoTracks()[0].onended = () => {
          screenStreamRef.current = null;
          if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
          audioStudioEngine.setSystemStream(null);
          setHasScreen(false);
        };
      }
    } catch (err: any) {
      console.warn('Screen share permission skipped or denied:', err);
      if (err.name !== 'NotAllowedError') {
        setPermissionError(err.message || 'Screen sharing was cancelled or denied.');
      }
    } finally {
      setIsRequestingPermissions(false);
    }
  };

  // Floating Face View & Mini Controller PiP Manager
  const openFloatingFacePip = useCallback(async () => {
    if (pipWindow && !pipWindow.closed) {
      pipWindow.focus();
      return;
    }

    if (typeof window !== 'undefined' && 'documentPictureInPicture' in window) {
      try {
        const win = await (window as any).documentPictureInPicture.requestWindow({
          width: 270,
          height: 340,
        });

        win.document.title = '🔴 ShotOnce · Floating Face';

        const style = win.document.createElement('style');
        style.textContent = `
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #07080A; margin: 0; padding: 0; overflow: hidden; font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; }
        `;
        win.document.head.appendChild(style);

        [...document.styleSheets].forEach((sheet) => {
          try {
            if (sheet.cssRules) {
              const newStyle = win.document.createElement('style');
              [...sheet.cssRules].forEach((rule) => {
                newStyle.textContent += rule.cssText;
              });
              win.document.head.appendChild(newStyle);
            }
          } catch (e) {
            if (sheet.href) {
              const link = win.document.createElement('link');
              link.rel = 'stylesheet';
              link.href = sheet.href;
              win.document.head.appendChild(link);
            }
          }
        });

        win.addEventListener('pagehide', () => {
          setPipWindow(null);
        });

        setPipWindow(win);
      } catch (err) {
        console.warn('Document Picture-in-Picture error:', err);
      }
    } else if (cameraVideoRef.current && 'requestPictureInPicture' in cameraVideoRef.current) {
      try {
        await cameraVideoRef.current.requestPictureInPicture();
      } catch (err) {
        console.warn('Video Picture-in-Picture fallback error:', err);
      }
    }
  }, [pipWindow]);

  const closeFloatingFacePip = useCallback(() => {
    if (pipWindow && !pipWindow.closed) {
      pipWindow.close();
      setPipWindow(null);
    }
  }, [pipWindow]);

  const handleToggleFloatingPip = useCallback(() => {
    if (pipWindow && !pipWindow.closed) {
      closeFloatingFacePip();
    } else {
      openFloatingFacePip();
    }
  }, [pipWindow, openFloatingFacePip, closeFloatingFacePip]);

  // Dynamic Browser Tab Title with REC indicator & Live Timer
  useEffect(() => {
    if (!isRecording) {
      document.title = 'ShotOnce Studio · 4K 60fps Single-Capture Multi-Aspect';
      return;
    }
    const mins = Math.floor(recordingDuration / 60);
    const secs = recordingDuration % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    document.title = `🔴 REC [${timeStr}] · ShotOnce Studio`;
  }, [isRecording, recordingDuration]);

  // Recording Execution
  const startRecording = useCallback(() => {
    const canvas = masterCanvasRef.current;
    if (!canvas) return;

    recordedChunksRef.current = [];
    const stream = canvas.captureStream(60);

    // Attach mixed audio
    const audioTrack = audioStudioEngine.getMixedTrack();
    if (audioTrack) {
      stream.addTrack(audioTrack);
    }

    const preferredMimes = [
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=h264,opus',
      'video/webm',
    ];
    let chosenMime = 'video/webm';
    for (const mime of preferredMimes) {
      if (MediaRecorder.isTypeSupported(mime)) {
        chosenMime = mime;
        break;
      }
    }

    const recorder = new MediaRecorder(stream, {
      mimeType: chosenMime,
      videoBitsPerSecond: 12_000_000,
    });

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = async () => {
      const durationMs = Date.now() - recordingStartTimeRef.current;
      const masterBlob = new Blob(recordedChunksRef.current, { type: chosenMime });

      // Generate thumbnail from canvas
      const thumbUrl = canvas.toDataURL('image/jpeg', 0.8);

      const newTake: RecordedTake = {
        id: 'take_' + Date.now(),
        timestamp: Date.now(),
        durationMs,
        masterBlob,
        thumbnailUrl: thumbUrl,
        name: `Take ${takes.length + 1} - Studio Session`,
        trimStartMs: 0,
        trimEndMs: durationMs,
        settingsSnapshot: { ...settings },
      };

      await saveTakeToLibrary(newTake);
      setTakes((prev) => [newTake, ...prev]);
      setSelectedTakeForTrim(newTake);
    };

    recordingStartTimeRef.current = Date.now();
    setRecordingDuration(0);
    setIsRecording(true);

    recorder.start(100);
    mediaRecorderRef.current = recorder;

    recordingTimerRef.current = window.setInterval(() => {
      setRecordingDuration(Math.floor((Date.now() - recordingStartTimeRef.current) / 1000));
    }, 1000);

    // Auto-pop floating controller & face view so user can see their camera & timer across other apps
    openFloatingFacePip().catch(console.warn);
  }, [settings, takes.length, openFloatingFacePip]);

  const stopRecording = useCallback(() => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const handleDeleteTake = async (id: string) => {
    await deleteTakeFromLibrary(id);
    setTakes((prev) => prev.filter((t) => t.id !== id));
    if (selectedTakeForTrim?.id === id) {
      setSelectedTakeForTrim(null);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#07080a] text-white overflow-hidden select-none">
      {/* Hidden elements for media feeds */}
      <video ref={screenVideoRef} muted playsInline className="hidden" />
      <video ref={cameraVideoRef} muted playsInline className="hidden" />

      {/* Studio Header Bar */}
      <StudioHeader
        settings={settings}
        onUpdateSettings={setSettings}
        isRecording={isRecording}
        recordingDuration={recordingDuration}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        hasScreen={hasScreen}
        hasCamera={hasCamera}
        hasMic={hasMic}
        isFloatingPipOpen={!!pipWindow}
        onToggleScreen={handleToggleScreen}
        onToggleCamera={handleToggleCamera}
        onToggleMic={handleToggleMic}
        onToggleFloatingPip={handleToggleFloatingPip}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onToggleScopes={() => setIsScopesOpen((v) => !v)}
        libraryCount={takes.length}
      />

      {/* Main Workspace (Stage + Right Inspector Sidebar) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Central Stage */}
        <StudioStage
          settings={settings}
          onUpdateSettings={setSettings}
          masterCanvasRef={masterCanvasRef}
          hasScreen={hasScreen}
          hasCamera={hasCamera}
          hasMic={hasMic}
          isRequestingPermissions={isRequestingPermissions}
          onToggleScreen={handleToggleScreen}
          onToggleCamera={handleToggleCamera}
          onToggleMic={handleToggleMic}
          onGrantAllPermissions={handleGrantAllPermissions}
        />

        {/* Right Inspector Sidebar */}
        <InspectorSidebar
          settings={settings}
          onUpdateSettings={setSettings}
          audioDevices={audioDevices}
        />

        {/* Floating Teleprompter HUD */}
        {settings.teleprompterVisible && (
          <TeleprompterHUD
            settings={settings}
            onUpdateSettings={setSettings}
            onClose={() =>
              setSettings((prev) => ({ ...prev, teleprompterVisible: false }))
            }
          />
        )}

        {/* Blackmagic Cinema Scopes Modal */}
        {isScopesOpen && (
          <CinemaScopesModal
            settings={settings}
            onUpdateSettings={setSettings}
            histogramBins={histogramBins}
            clippingPercent={clippingPercent}
            onClose={() => setIsScopesOpen(false)}
          />
        )}
      </div>

      {/* In-Browser Capture Library Drawer */}
      <CaptureLibraryDrawer
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        takes={takes}
        onSelectTakeForTrim={(t) => {
          setSelectedTakeForTrim(t);
          setIsLibraryOpen(false);
        }}
        onDeleteTake={handleDeleteTake}
      />

      {/* Timeline Trimmer & 1-Click Multi-Aspect Export Modal */}
      {selectedTakeForTrim && (
        <TrimTimelineModal
          take={selectedTakeForTrim}
          settings={settings}
          onClose={() => setSelectedTakeForTrim(null)}
          onSaveTrim={(updated) => {
            setSelectedTakeForTrim(updated);
            setTakes((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
          }}
        />
      )}

      {/* Always-On-Top Floating Face View & Recorder (Picture-in-Picture) */}
      {pipWindow && (
        <FloatingFacePip
          pipWindow={pipWindow}
          cameraStream={cameraStreamRef.current}
          hasCamera={hasCamera}
          hasMic={hasMic}
          isRecording={isRecording}
          recordingDuration={recordingDuration}
          isMirrored={settings.cameraMirrored}
          onStopRecording={stopRecording}
          onStartRecording={startRecording}
          onToggleMic={handleToggleMic}
          onClosePip={closeFloatingFacePip}
        />
      )}
    </div>
  );
};
