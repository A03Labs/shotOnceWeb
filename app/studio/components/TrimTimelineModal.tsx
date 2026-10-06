import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Scissors,
  Download,
  Archive,
  Save,
  Trash2,
  X,
  Layers,
  Sparkles,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import {
  ASPECT_RATIOS,
  type AspectRatioId,
  type RecordedTake,
  type StudioSettings
} from '../types';
import {
  deriveVideoForAspect,
  downloadAllAspectsZip,
  triggerDownload
} from '../derivation-exporter';
import { updateTakeInLibrary } from '../storage';

interface TrimTimelineModalProps {
  take: RecordedTake;
  settings: StudioSettings;
  onClose: () => void;
  onSaveTrim: (updatedTake: RecordedTake) => void;
}

export const TrimTimelineModal: React.FC<TrimTimelineModalProps> = ({
  take,
  settings,
  onClose,
  onSaveTrim,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(take.durationMs / 1000 || 1);

  // In / Out trim marks in seconds
  const [inPoint, setInPoint] = useState((take.trimStartMs || 0) / 1000);
  const [outPoint, setOutPoint] = useState(
    (take.trimEndMs || take.durationMs || 1000) / 1000
  );

  const [activeAspectPreview, setActiveAspectPreview] = useState<AspectRatioId>('16:9');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const videoUrl = React.useMemo(() => URL.createObjectURL(take.masterBlob), [take.masterBlob]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (videoRef.current.currentTime >= outPoint) {
        videoRef.current.currentTime = inPoint;
      }
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    // Loop within trim range
    if (cur >= outPoint) {
      videoRef.current.currentTime = inPoint;
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || duration;
      setDuration(dur);
      if (outPoint > dur || outPoint === 0) setOutPoint(dur);
    }
  };

  const formatSec = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    const ms = Math.floor((s % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const handleSaveTrimRange = async () => {
    const updated: RecordedTake = {
      ...take,
      trimStartMs: Math.round(inPoint * 1000),
      trimEndMs: Math.round(outPoint * 1000),
    };
    await updateTakeInLibrary(updated);
    onSaveTrim(updated);
  };

  // Export a single derived aspect ratio
  const handleExportSingle = async (aspectId: AspectRatioId) => {
    setIsExporting(true);
    setExportStatus(`Deriving ${ASPECT_RATIOS[aspectId].name}...`);
    try {
      const updatedTake = {
        ...take,
        trimStartMs: Math.round(inPoint * 1000),
        trimEndMs: Math.round(outPoint * 1000),
      };
      const blob = await deriveVideoForAspect(updatedTake, aspectId, (p) => {
        setProgressPercent(Math.round(p * 100));
      });
      const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
      const cleanName = take.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      triggerDownload(blob, `${cleanName}-${aspectId.replace(':', 'x')}.${ext}`);
      setExportStatus('Done!');
    } catch (err) {
      console.error(err);
      alert('Derivation export failed: ' + err);
    } finally {
      setIsExporting(false);
      setProgressPercent(0);
    }
  };

  // Export All as ZIP
  const handleExportAllZip = async () => {
    setIsExporting(true);
    try {
      const updatedTake = {
        ...take,
        trimStartMs: Math.round(inPoint * 1000),
        trimEndMs: Math.round(outPoint * 1000),
      };
      await downloadAllAspectsZip(
        updatedTake,
        settings.activeDerivations,
        (status) => setExportStatus(status)
      );
      setExportStatus('ZIP download ready!');
    } catch (err) {
      console.error(err);
      alert('ZIP export failed: ' + err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#090c10] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{take.name}</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  MASTER TAKE
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">
                Trim pre-roll/post-roll and instantly export derived aspect ratios
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Stage */}
        <div className="relative bg-black flex-1 min-h-[340px] flex items-center justify-center p-4 overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="max-h-[380px] max-w-full rounded-xl border border-white/10 shadow-2xl"
          />

          {/* Quick Play Overlay button */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black border border-white/20 text-white flex items-center justify-center transition-all opacity-0 hover:opacity-100"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
        </div>

        {/* Timeline & Scrubber Deck */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10 space-y-3">
          {/* Scrubber with In/Out markers */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-gray-400">
                Current: <strong className="text-amber-400">{formatSec(currentTime)}</strong>
              </span>
              <span className="text-gray-400">
                Selected Duration:{' '}
                <strong className="text-white">{formatSec(Math.max(0, outPoint - inPoint))}</strong> /{' '}
                {formatSec(duration)}
              </span>
            </div>

            {/* Visual Timeline Bar */}
            <div className="relative h-9 bg-black/80 rounded-xl border border-white/10 overflow-hidden flex items-center px-2">
              {/* Highlighted trimmed region */}
              <div
                style={{
                  left: `${(inPoint / duration) * 100}%`,
                  width: `${((outPoint - inPoint) / duration) * 100}%`,
                }}
                className="absolute top-0 bottom-0 bg-amber-500/20 border-x-2 border-amber-500"
              />

              {/* Playhead */}
              <div
                style={{ left: `${(currentTime / duration) * 100}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-md shadow-red-500 pointer-events-none z-10"
              />

              {/* Scrub range input */}
              <input
                type="range"
                min="0"
                max={duration}
                step="0.05"
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (videoRef.current) {
                    videoRef.current.currentTime = val;
                    setCurrentTime(val);
                  }
                }}
                className="w-full relative z-20 opacity-0 cursor-pointer h-full"
              />
            </div>
          </div>

          {/* In / Out Cut buttons and Playback Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="px-4 py-1.5 rounded-lg font-semibold text-xs bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={() => setInPoint(currentTime)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300"
                title="Set In-Point to current playhead"
              >
                Mark In [{formatSec(inPoint)}]
              </button>

              <button
                onClick={() => setOutPoint(currentTime)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300"
                title="Set Out-Point to current playhead"
              >
                Mark Out [{formatSec(outPoint)}]
              </button>

              <button
                onClick={handleSaveTrimRange}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Trim</span>
              </button>
            </div>

            {/* Export Status Message */}
            {isExporting && (
              <div className="flex items-center gap-2 text-xs font-medium text-amber-400 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{exportStatus} {progressPercent > 0 ? `(${progressPercent}%)` : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Export Master Video Deck */}
        <div className="p-5 bg-[#131518] flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F3F5F7] flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Export Studio Video</span>
            </h3>
            <p className="text-[11px] text-[#969EAA]">
              Native 60fps video download composited directly in your browser
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={isExporting}
              onClick={() => handleExportSingle('16:9')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#E5A93C] hover:bg-[#D4982B] text-[#0D0E11] flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#0D0E11]" />
              <span>Download Video</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
