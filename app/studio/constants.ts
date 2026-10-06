import type { StudioSettings, TeleprompterTemplate } from './types';

export interface BackdropPreset {
  id: string;
  name: string;
  category: 'gradient' | 'mesh' | 'solid';
  css: string;
  previewColors: string[];
}

export const BACKDROP_PRESETS: BackdropPreset[] = [
  {
    id: 'shotonce-mesh',
    name: 'ShotOnce Luminous',
    category: 'mesh',
    css: 'radial-gradient(at 0% 0%, rgba(229, 169, 60, 0.35) 0px, transparent 55%), radial-gradient(at 100% 100%, rgba(20, 184, 166, 0.25) 0px, transparent 55%), radial-gradient(at 50% 50%, rgba(59, 130, 246, 0.15) 0px, transparent 70%), #07080a',
    previewColors: ['#e5a93c', '#14b8a6', '#07080a'],
  },
  {
    id: 'amber-sunset',
    name: 'Amber Sunset',
    category: 'gradient',
    css: 'radial-gradient(ellipse at 50% 10%, #3e1e07 0%, #1b0d04 55%, #080502 100%)',
    previewColors: ['#f59e0b', '#78350f', '#080502'],
  },
  {
    id: 'deep-obsidian',
    name: 'Deep Obsidian',
    category: 'gradient',
    css: 'radial-gradient(circle at 50% 25%, #1e2638 0%, #0d1117 60%, #06080b 100%)',
    previewColors: ['#334155', '#0f172a', '#020617'],
  },
  {
    id: 'cyber-teal',
    name: 'Cyber Teal',
    category: 'gradient',
    css: 'linear-gradient(135deg, #042f2e 0%, #091a24 50%, #021210 100%)',
    previewColors: ['#14b8a6', '#0f172a', '#042f2e'],
  },
  {
    id: 'neon-dusk',
    name: 'Neon Dusk',
    category: 'gradient',
    css: 'linear-gradient(135deg, #2e0854 0%, #110e2e 50%, #4c0519 100%)',
    previewColors: ['#a855f7', '#ec4899', '#1e1b4b'],
  },
  {
    id: 'velvet-noir',
    name: 'Velvet Noir',
    category: 'solid',
    css: 'radial-gradient(circle at 50% 50%, #202024 0%, #101012 50%, #080809 100%)',
    previewColors: ['#27272a', '#18181b', '#09090b'],
  },
  {
    id: 'studio-carbon',
    name: 'Studio Carbon',
    category: 'solid',
    css: '#07080a',
    previewColors: ['#07080a', '#12161f', '#000000'],
  },
];

export const TELEPROMPTER_TEMPLATES: TeleprompterTemplate[] = [
  {
    id: 'shotonce-hook',
    title: 'High-Retention Social Hook',
    category: 'Social Media',
    content: `Stop recording your screen 3 different times just to get YouTube, TikTok, and LinkedIn exports.

With ShotOnce Web, you hit record once on desktop. 

The studio wraps your screen in gorgeous Cap.so backdrops, adds your 4K webcam in a clean glowing circle, and instantly exports 16:9, 9:16 vertical, and 1:1 square videos simultaneously.

Zero server uploads. 100% private. 

Try it now right in your browser!`,
  },
  {
    id: 'saas-explainer',
    title: '60-Second SaaS Explainer',
    category: 'Product Demo',
    content: `Hey everyone! Today I want to show you the brand new release we just shipped.

Most tools force you to trade off speed for video production quality. 

Notice how when I navigate here, the studio auto-centers and smooth-zooms directly into the action.

Every frame is rendered in full 60fps with real-time cinema color science.

Click the link below to get your hands on this today!`,
  },
  {
    id: 'changelog-teaser',
    title: 'X/Twitter Changelog Teaser',
    category: 'Changelog',
    content: `Changelog v2.4 is officially LIVE!

Here are the 3 biggest upgrades we just dropped:

1. Simultaneous multi-aspect exports for TikTok & YouTube.
2. Built-in Blackmagic cinema LUTs and real-time luminance zebras.
3. Floating teleprompter positioned directly on your eye-line.

Check out the full release notes in the description!`,
  },
  {
    id: 'investor-pitch',
    title: 'Investor & Client Elevator Pitch',
    category: 'Pitch',
    content: `Creators and SaaS founders lose over 15 hours every week re-formatting video content for multiple social platforms.

We built ShotOnce to solve this at the browser level. Single capture, multi-format derivation, studio-grade styling, and zero cloud wait times.

Our engine runs completely client-side via WebCodecs and WebRTC.`,
  },
];

export const DEFAULT_STUDIO_SETTINGS: StudioSettings = {
  backdropType: 'preset',
  backdropPreset: 'shotonce-mesh',
  customBackdropUrl: null,
  padding: 48,
  cornerRadius: 18,
  shadowPreset: 'bold',
  windowFrame: 'macos',

  cameraLayout: 'circle',
  cameraScale: 24,
  cameraPosition: { x: 82, y: 78 }, // bottom right percentage
  cameraMirrored: true,
  cameraBorderRadius: 999,
  cameraGlow: true,

  zoomLevel: 1.0,
  anchorPoint: { x: 50, y: 50 },

  cinemaLut: 'standard',
  zebrasEnabled: false,
  zebraThreshold: 242,
  histogramEnabled: true,

  micVolume: 1.0,
  systemVolume: 1.0,
  noiseGate: true,
  compressor: true,
  selectedMicId: 'default',

  teleprompterVisible: false,
  teleprompterSpeedWpm: 130,
  teleprompterFontSize: 18,
  teleprompterText: TELEPROMPTER_TEMPLATES[0].content,
  teleprompterMirrored: false,

  activeDerivations: ['16:9', '9:16', '1:1', '4:5'],
  previewAspectRatio: 'all',
};
