import React from 'react';
import {
  FileVideo,
  Scissors,
  Download,
  Trash2,
  X,
  Play,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import type { RecordedTake } from '../types';
import { triggerDownload } from '../derivation-exporter';

interface CaptureLibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  takes: RecordedTake[];
  onSelectTakeForTrim: (take: RecordedTake) => void;
  onDeleteTake: (id: string) => void;
}

export const CaptureLibraryDrawer: React.FC<CaptureLibraryDrawerProps> = ({
  isOpen,
  onClose,
  takes,
  onSelectTakeForTrim,
  onDeleteTake,
}) => {
  if (!isOpen) return null;

  const formatDuration = (ms: number) => {
    const s = Math.round(ms / 1000);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-96 h-full bg-[#090c10] border-l border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileVideo className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Capture Library</h2>
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
              {takes.length} Takes
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Takes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {takes.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-500">
              <FileVideo className="w-10 h-10 mb-2 opacity-40 text-amber-400" />
              <p className="text-xs font-medium text-gray-300">No Takes Recorded Yet</p>
              <p className="text-[11px] text-gray-500 mt-1">
                Hit &ldquo;Record Master&rdquo; to capture your screen and webcam. Takes will be
                preserved in private browser storage.
              </p>
            </div>
          ) : (
            takes.map((take) => (
              <div
                key={take.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all group flex flex-col gap-2.5"
              >
                {/* Thumbnail & Duration */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-white/10">
                  {take.thumbnailUrl ? (
                    <img
                      src={take.thumbnailUrl}
                      alt={take.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600 text-xs">
                      Master Take
                    </div>
                  )}

                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white">
                    {formatDuration(take.durationMs)}
                  </span>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-semibold text-white truncate max-w-[170px]">{take.name}</h3>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {formatDate(take.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Trim and derive */}
                    <button
                      onClick={() => onSelectTakeForTrim(take)}
                      className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black border border-amber-500/30 transition-all"
                      title="Trim & Export Multi-Aspect Derivations"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                    </button>

                    {/* Instant Download Master */}
                    <button
                      onClick={() => {
                        const ext = take.masterBlob.type.includes('mp4') ? 'mp4' : 'webm';
                        triggerDownload(take.masterBlob, `${take.name.toLowerCase()}.${ext}`);
                      }}
                      className="p-1.5 rounded-lg bg-white/10 text-gray-200 hover:text-white hover:bg-white/20 transition-all"
                      title="Download Master Recording"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDeleteTake(take.id)}
                      className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Delete Take"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
