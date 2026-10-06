import { downloadZip } from 'client-zip';
import { ASPECT_RATIOS, type AspectRatioId, type RecordedTake } from './types';

/**
 * Calculates crop coordinates in the 1920x1080 master canvas for any target aspect ratio
 */
export function calculateAspectCrop(
  masterWidth: number,
  masterHeight: number,
  aspectId: AspectRatioId,
  anchorPercentX = 50,
  _anchorPercentY = 50
): { sx: number; sy: number; sWidth: number; sHeight: number } {
  if (aspectId === '16:9') {
    return { sx: 0, sy: 0, sWidth: masterWidth, sHeight: masterHeight };
  }

  const targetConfig = ASPECT_RATIOS[aspectId];
  const targetAspect = targetConfig.width / targetConfig.height; // e.g. 9/16 = 0.5625, 1/1 = 1, 4/5 = 0.8
  const masterAspect = masterWidth / masterHeight;

  let sWidth: number;
  let sHeight: number;

  if (targetAspect < masterAspect) {
    // Taller than master (vertical, square, 4:5): crop horizontally
    sHeight = masterHeight;
    sWidth = Math.round(sHeight * targetAspect);
  } else {
    // Wider than master: crop vertically
    sWidth = masterWidth;
    sHeight = Math.round(sWidth / targetAspect);
  }

  // Anchor center x
  const anchorX = (anchorPercentX / 100) * masterWidth;
  let sx = Math.round(anchorX - sWidth / 2);

  // Clamp within bounds
  if (sx < 0) sx = 0;
  if (sx + sWidth > masterWidth) sx = masterWidth - sWidth;

  const sy = 0;

  return { sx, sy, sWidth, sHeight };
}

/**
 * Derives a video for a specific aspect ratio from a master video blob
 */
export async function deriveVideoForAspect(
  take: RecordedTake,
  aspectId: AspectRatioId,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(take.masterBlob);
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = async () => {
      try {
        const masterWidth = video.videoWidth || 1920;
        const masterHeight = video.videoHeight || 1080;
        const targetConfig = ASPECT_RATIOS[aspectId];

        const canvas = document.createElement('canvas');
        canvas.width = targetConfig.width;
        canvas.height = targetConfig.height;
        const ctx = canvas.getContext('2d', { alpha: false });

        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        const anchorX = take.settingsSnapshot.anchorPoint?.x ?? 50;
        const anchorY = take.settingsSnapshot.anchorPoint?.y ?? 50;
        const crop = calculateAspectCrop(masterWidth, masterHeight, aspectId, anchorX, anchorY);

        const startTime = (take.trimStartMs || 0) / 1000;
        const endTime = (take.trimEndMs || take.durationMs) / 1000;
        const totalDuration = Math.max(0.5, endTime - startTime);

        // Pick best supported mimeType
        const preferredMimes = [
          'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
          'video/mp4',
          'video/webm;codecs=vp9',
          'video/webm;codecs=h264',
          'video/webm',
        ];
        let chosenMime = 'video/webm';
        for (const mime of preferredMimes) {
          if (MediaRecorder.isTypeSupported(mime)) {
            chosenMime = mime;
            break;
          }
        }

        const stream = canvas.captureStream(30);
        // Also capture audio from master video
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const source = audioContext.createMediaElementSource(video);
        const dest = audioContext.createMediaStreamDestination();
        source.connect(dest);
        const audioTracks = dest.stream.getAudioTracks();
        if (audioTracks.length > 0) {
          stream.addTrack(audioTracks[0]);
        }

        const recorder = new MediaRecorder(stream, {
          mimeType: chosenMime,
          videoBitsPerSecond: 8_000_000,
        });

        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          audioContext.close().catch(() => {});
          URL.revokeObjectURL(video.src);
          const finalBlob = new Blob(chunks, { type: chosenMime });
          resolve(finalBlob);
        };

        video.currentTime = startTime;

        await new Promise<void>((r) => {
          video.onseeked = () => r();
        });

        recorder.start(100);
        await video.play();

        let animFrameId: number;
        const renderLoop = () => {
          if (video.currentTime >= endTime || video.ended || video.paused) {
            cancelAnimationFrame(animFrameId);
            video.pause();
            if (recorder.state === 'recording') {
              recorder.stop();
            }
            return;
          }

          const currentElapsed = video.currentTime - startTime;
          const prog = Math.min(1, Math.max(0, currentElapsed / totalDuration));
          if (onProgress) onProgress(prog);

          ctx.drawImage(
            video,
            crop.sx,
            crop.sy,
            crop.sWidth,
            crop.sHeight,
            0,
            0,
            canvas.width,
            canvas.height
          );

          animFrameId = requestAnimationFrame(renderLoop);
        };

        animFrameId = requestAnimationFrame(renderLoop);
      } catch (err) {
        reject(err);
      }
    };

    video.onerror = (e) => reject(new Error('Failed to load master video for derivation: ' + e));
  });
}

/**
 * Downloads a single Blob with filename
 */
export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Packages all active aspect ratios into a ZIP archive using client-zip
 */
export async function downloadAllAspectsZip(
  take: RecordedTake,
  aspectIds: AspectRatioId[],
  onStatusUpdate?: (status: string) => void
): Promise<void> {
  const files: { name: string; lastModified: Date; input: Blob }[] = [];

  for (let i = 0; i < aspectIds.length; i++) {
    const id = aspectIds[i];
    const cfg = ASPECT_RATIOS[id];
    if (onStatusUpdate) {
      onStatusUpdate(`Rendering ${cfg.name} (${i + 1}/${aspectIds.length})...`);
    }

    const derivedBlob = await deriveVideoForAspect(take, id);
    const ext = derivedBlob.type.includes('mp4') ? 'mp4' : 'webm';
    const filename = `${take.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${id.replace(':', 'x')}.${ext}`;

    files.push({
      name: filename,
      lastModified: new Date(take.timestamp),
      input: derivedBlob,
    });
  }

  if (onStatusUpdate) onStatusUpdate('Packing ZIP archive...');
  const zipBlob = await downloadZip(files).blob();
  triggerDownload(zipBlob, `${take.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-shotonce-all-aspects.zip`);
}
