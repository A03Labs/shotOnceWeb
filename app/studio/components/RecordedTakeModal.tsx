import React from 'react';
import { Download, X, Play, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { RecordedTake } from '../types';

interface RecordedTakeModalProps {
  take: RecordedTake;
  onClose: () => void;
}

export const RecordedTakeModal: React.FC<RecordedTakeModalProps> = ({
  take,
  onClose,
}) => {
  const videoUrl = React.useMemo(() => {
    return URL.createObjectURL(take.masterBlob);
  }, [take.masterBlob]);

  React.useEffect(() => {
    return () => {
      URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const formatDuration = (ms: number) => {
    const totalSecs = Math.round(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const ext = take.masterBlob.type.includes('mp4') ? 'mp4' : 'webm';
    const filename = `shotonce_take_${new Date(take.timestamp).toISOString().replace(/[:.]/g, '-')}.${ext}`;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const sizeMb = (take.masterBlob.size / (1024 * 1024)).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 bg-[#07080A]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl bg-[#131518] rounded-2xl p-6 sm:p-8 flex flex-col gap-5 text-left shadow-2xl border border-white/5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F3F5F7] font-['Outfit']">
                Recording Complete
              </h3>
              <p className="text-xs font-mono text-[#969EAA]">
                {formatDuration(take.durationMs)} · {sizeMb} MB · 1080p Composited
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#969EAA] hover:text-[#F3F5F7] rounded-xl hover:bg-[#1C2026] transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-[#07080A] ring-1 ring-white/10">
          <video
            src={videoUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleDownload}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl text-xs font-bold bg-[#E5A93C] hover:bg-[#FFB834] text-[#0D0E11] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#E5A93C]/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Recording</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl text-xs font-semibold bg-[#1C2026] hover:bg-[#262B33] text-[#F3F5F7] flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-[#969EAA]" />
            <span>Record New Take</span>
          </button>
        </div>
      </div>
    </div>
  );
};
