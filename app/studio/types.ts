export type AspectRatioId = '16:9' | '9:16' | '1:1' | '4:5';

export interface AspectRatioConfig {
  id: AspectRatioId;
  name: string;
  width: number;
  height: number;
  label: string;
  icon: string;
  badge: string;
}

export const ASPECT_RATIOS: Record<AspectRatioId, AspectRatioConfig> = {
  '16:9': {
    id: '16:9',
    name: 'Widescreen (16:9)',
    width: 1920,
    height: 1080,
    label: 'YouTube / Loom',
    icon: 'Monitor',
    badge: '1920×1080',
  },
  '9:16': {
    id: '9:16',
    name: 'Vertical (9:16)',
    width: 1080,
    height: 1920,
    label: 'TikTok / Shorts / Reels',
    icon: 'Smartphone',
    badge: '1080×1920',
  },
  '1:1': {
    id: '1:1',
    name: 'Square (1:1)',
    width: 1080,
    height: 1080,
    label: 'Instagram / LinkedIn',
    icon: 'Square',
    badge: '1080×1080',
  },
  '4:5': {
    id: '4:5',
    name: 'Portrait (4:5)',
    width: 1080,
    height: 1350,
    label: 'Instagram Feed / Ads',
    icon: 'RectangleVertical',
    badge: '1080×1350',
  },
};

export type CameraLayout =
  | 'split-top'
  | 'split-bottom'
  | 'split-left'
  | 'split-right'
  | 'circle'
  | 'rounded-pip'
  | 'fullscreen'
  | 'hidden';

export type DropShadowPreset = 'none' | 'soft' | 'bold' | 'amber-glow';

export type WindowFrameMockup = 'macos' | 'browser' | 'borderless';

export type CinemaLUT = 'standard' | 'cinema-warm' | 'cool-teal' | 'noir' | 'flat-log';

export interface StudioSettings {
  // Canvas styling
  backdropType: 'preset' | 'mesh' | 'solid' | 'custom';
  backdropPreset: string;
  customBackdropUrl: string | null;
  padding: number; // 0 to 120
  cornerRadius: number; // 0 to 32
  shadowPreset: DropShadowPreset;
  windowFrame: WindowFrameMockup;

  // Camera settings
  cameraLayout: CameraLayout;
  cameraScale: number; // 15 to 45%
  cameraPosition: { x: number; y: number }; // percentages 0-100
  cameraMirrored: boolean;
  cameraBorderRadius: number;
  cameraGlow: boolean;

  // Zoom and anchor
  zoomLevel: number; // 1.0, 1.5, 2.0
  anchorPoint: { x: number; y: number }; // 0-100 percentage for 9:16 crop focus

  // Cinema Suite
  cinemaLut: CinemaLUT;
  zebrasEnabled: boolean;
  zebraThreshold: number; // 90 to 98
  histogramEnabled: boolean;

  // Audio Mixer
  micVolume: number; // 0 to 1
  systemVolume: number; // 0 to 1
  noiseGate: boolean;
  compressor: boolean;
  selectedMicId: string;

  // Teleprompter
  teleprompterVisible: boolean;
  teleprompterSpeedWpm: number;
  teleprompterFontSize: number;
  teleprompterText: string;
  teleprompterMirrored: boolean;

  // Multi-aspect derivations active
  activeDerivations: AspectRatioId[];
  previewAspectRatio: AspectRatioId | 'all';
}

export interface RecordedTake {
  id: string;
  timestamp: number;
  durationMs: number;
  masterBlob: Blob;
  thumbnailUrl: string;
  name: string;
  trimStartMs: number;
  trimEndMs: number;
  settingsSnapshot: StudioSettings;
}

export interface TeleprompterTemplate {
  id: string;
  title: string;
  category: string;
  content: string;
}
