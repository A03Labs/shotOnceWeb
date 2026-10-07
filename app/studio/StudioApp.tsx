import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StudioHeader } from './components/StudioHeader';
import { StudioStage } from './components/StudioStage';
import { RecordedTakeModal } from './components/RecordedTakeModal';
import { FloatingFacePip } from './components/FloatingFacePip';
import { CanvasCompositor } from './compositor';
import { audioStudioEngine } from './audio-engine';
import { DEFAULT_STUDIO_SETTINGS } from './constants';
import type { RecordedTake, StudioSettings } from './types';

export const StudioApp: React.FC = () => {
  const [settings, setSettings] = useState<StudioSettings>(DEFAULT_STUDIO_SETTINGS);
  const [hasScreen, setHasScreen] = useState<boolean>(false);
  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [hasMic, setHasMic] = useState<boolean>(false);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState<boolean>(false);
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [isSharingEntireMonitor, setIsSharingEntireMonitor] = useState<boolean>(false);

  // Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [completedTake, setCompletedTake] = useState<RecordedTake | null>(null);

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

  // Initialize Audio Engine on mount
  useEffect(() => {
    audioStudioEngine.init();

    return () => {
      audioStudioEngine.cleanup();
      if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach((t) => t.stop());
      if (cameraStreamRef.current) cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      if (micStreamRef.current) micStreamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Main 60fps Canvas Compositing Loop
  useEffect(() => {
    let animId: number;

    const render = () => {
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
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [settings, hasScreen, hasCamera]);

  // Toggle Screen Sharing
  const handleToggleScreen = async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
      audioStudioEngine.setSystemStream(null);
      setHasScreen(false);
      setIsSharingEntireMonitor(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 60 },
        audio: true,
        selfBrowserSurface: 'exclude',
        systemAudio: 'include',
      } as any);

      const videoTrack = stream.getVideoTracks()[0];
      const trackSettings = (videoTrack?.getSettings?.() as any) || {};
      setIsSharingEntireMonitor(trackSettings.displaySurface === 'monitor');

      screenStreamRef.current = stream;
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = stream;
        screenVideoRef.current.play().catch(console.warn);
      }

      audioStudioEngine.setSystemStream(stream);
      setHasScreen(true);

      videoTrack.onended = () => {
        screenStreamRef.current = null;
        if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
        audioStudioEngine.setSystemStream(null);
        setHasScreen(false);
        setIsSharingEntireMonitor(false);
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
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });

      micStreamRef.current = stream;
      audioStudioEngine.setMicrophoneStream(stream);
      setHasMic(true);
    } catch (err) {
      console.warn('Microphone permission cancelled or not allowed:', err);
    }
  };

  // Grant All Studio Permissions Flow
  const handleGrantAllPermissions = async () => {
    setIsRequestingPermissions(true);

    try {
      if (!cameraStreamRef.current || !micStreamRef.current) {
        const needCam = !cameraStreamRef.current;
        const needMic = !micStreamRef.current;

        const avStream = await navigator.mediaDevices.getUserMedia({
          video: needCam
            ? { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: 'user' }
            : false,
          audio: needMic ? { echoCancellation: true, noiseSuppression: true } : false,
        });

        if (needCam) {
          const camTracks = avStream.getVideoTracks();
          if (camTracks.length > 0) {
            const camStream = new MediaStream(camTracks);
            cameraStreamRef.current = camStream;
            if (cameraVideoRef.current) {
              cameraVideoRef.current.srcObject = camStream;
              cameraVideoRef.current.play().catch(console.warn);
            }
            setHasCamera(true);
          }
        }

        if (needMic) {
          const micTracks = avStream.getAudioTracks();
          if (micTracks.length > 0) {
            const micStream = new MediaStream(micTracks);
            micStreamRef.current = micStream;
            audioStudioEngine.setMicrophoneStream(micStream);
            setHasMic(true);
          }
        }
      }
    } catch (err) {
      console.warn('Camera/Mic permission skipped or denied:', err);
    }

    try {
      if (!screenStreamRef.current) {
        const sStream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 60 },
          audio: true,
          selfBrowserSurface: 'exclude',
          systemAudio: 'include',
        } as any);

        const videoTrack = sStream.getVideoTracks()[0];
        const trackSettings = (videoTrack?.getSettings?.() as any) || {};
        setIsSharingEntireMonitor(trackSettings.displaySurface === 'monitor');

        screenStreamRef.current = sStream;
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = sStream;
          screenVideoRef.current.play().catch(console.warn);
        }
        audioStudioEngine.setSystemStream(sStream);
        setHasScreen(true);

        videoTrack.onended = () => {
          screenStreamRef.current = null;
          if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
          audioStudioEngine.setSystemStream(null);
          setHasScreen(false);
          setIsSharingEntireMonitor(false);
        };
      }
    } catch (err: any) {
      console.warn('Screen share permission skipped or denied:', err);
    } finally {
      setIsRequestingPermissions(false);
    }
  };

  // Floating Face View PiP Manager (Optional user popout)
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
        console.warn('Video PiP error:', err);
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

  // Tab Title Recording Indicator
  useEffect(() => {
    if (!isRecording) {
      document.title = 'ShotOnce Studio · Split Screen & Face Recording';
      return;
    }
    const mins = Math.floor(recordingDuration / 60);
    const secs = recordingDuration % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    document.title = `🔴 REC [${timeStr}] · ShotOnce`;
  }, [isRecording, recordingDuration]);

  // Recording Execution
  const startRecording = useCallback(() => {
    const canvas = masterCanvasRef.current;
    if (!canvas) return;

    recordedChunksRef.current = [];
    const stream = canvas.captureStream(60);

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
      const thumbUrl = canvas.toDataURL('image/jpeg', 0.8);

      const newTake: RecordedTake = {
        id: 'take_' + Date.now(),
        timestamp: Date.now(),
        durationMs,
        masterBlob,
        thumbnailUrl: thumbUrl,
        name: `Recording - ${new Date().toLocaleTimeString()}`,
        trimStartMs: 0,
        trimEndMs: durationMs,
        settingsSnapshot: { ...settings },
      };

      setCompletedTake(newTake);
    };

    recordingStartTimeRef.current = Date.now();
    setRecordingDuration(0);
    setIsRecording(true);

    recorder.start(100);
    mediaRecorderRef.current = recorder;

    recordingTimerRef.current = window.setInterval(() => {
      setRecordingDuration(Math.floor((Date.now() - recordingStartTimeRef.current) / 1000));
    }, 1000);
  }, [settings]);

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

  return (
    <div className="flex flex-col h-screen w-screen bg-[#07080A] text-white overflow-hidden select-none font-sans">
      {/* Hidden elements for media feeds */}
      <video ref={screenVideoRef} muted playsInline className="hidden" />
      <video ref={cameraVideoRef} muted playsInline className="hidden" />

      {/* Streamlined Studio Header Bar */}
      <StudioHeader
        settings={settings}
        onUpdateSettings={setSettings}
        isRecording={isRecording}
        recordingDuration={recordingDuration}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
      />

      {/* Central Full-Bleed Stage */}
      <StudioStage
        settings={settings}
        onUpdateSettings={setSettings}
        masterCanvasRef={masterCanvasRef}
        hasScreen={hasScreen}
        hasCamera={hasCamera}
        hasMic={hasMic}
        isFloatingPipOpen={!!pipWindow}
        isRequestingPermissions={isRequestingPermissions}
        onToggleScreen={handleToggleScreen}
        onToggleCamera={handleToggleCamera}
        onToggleMic={handleToggleMic}
        onToggleFloatingPip={handleToggleFloatingPip}
        onGrantAllPermissions={handleGrantAllPermissions}
      />

      {/* Instant Take Preview & Download Modal */}
      {completedTake && (
        <RecordedTakeModal
          take={completedTake}
          onClose={() => setCompletedTake(null)}
        />
      )}

      {/* Optional Always-On-Top Floating Face PiP Window */}
      {pipWindow && (
        <FloatingFacePip
          pipWindow={pipWindow}
          cameraStream={cameraStreamRef.current}
          hasCamera={hasCamera}
          hasMic={hasMic}
          isRecording={isRecording}
          recordingDuration={recordingDuration}
          isMirrored={settings.cameraMirrored}
          isSharingEntireMonitor={isSharingEntireMonitor}
          onStopRecording={stopRecording}
          onStartRecording={startRecording}
          onToggleMic={handleToggleMic}
          onClosePip={closeFloatingFacePip}
        />
      )}
    </div>
  );
};
