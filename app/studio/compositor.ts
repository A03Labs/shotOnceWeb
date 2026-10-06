import { BACKDROP_PRESETS } from './constants';
import { CINEMA_PROFILES, drawHighlightZebras } from './cinema-filters';
import type { StudioSettings } from './types';

/**
 * Draws rounded rectangle path
 */
export function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Master Canvas Compositor
 */
export class CanvasCompositor {
  private width = 1920;
  private height = 1080;
  private customBackdropImg: HTMLImageElement | null = null;
  private currentCustomUrl: string | null = null;

  // Zoom animation smoothing
  private currentZoom = 1.0;
  private targetZoom = 1.0;

  constructor(width = 1920, height = 1080) {
    this.width = width;
    this.height = height;
  }

  public setResolution(w: number, h: number) {
    this.width = w;
    this.height = h;
  }

  public render(
    ctx: CanvasRenderingContext2D,
    settings: StudioSettings,
    screenElement: HTMLVideoElement | null,
    cameraElement: HTMLVideoElement | null
  ) {
    this.targetZoom = settings.zoomLevel || 1.0;
    this.currentZoom += (this.targetZoom - this.currentZoom) * 0.12;

    const W = this.width;
    const H = this.height;

    ctx.save();
    ctx.clearRect(0, 0, W, H);

    // 1. Draw Backdrop
    this.drawBackdrop(ctx, settings, W, H);

    // 2. Calculate Window Dimensions based on Padding Slider (0 to 120)
    const scaleFactor = W / 1920;
    const pad = settings.padding * 1.5 * scaleFactor;
    const cornerRadius = settings.cornerRadius * 1.6 * scaleFactor;

    const winX = pad;
    const winY = pad;
    const winW = W - pad * 2;
    const winH = H - pad * 2;

    // Apply drop shadow
    ctx.save();
    this.applyShadow(ctx, settings.shadowPreset, scaleFactor);

    // Window base shape
    roundRectPath(ctx, winX, winY, winW, winH, cornerRadius);
    ctx.fillStyle = '#0d1015';
    ctx.fill();
    ctx.restore(); // remove shadow for inner content

    // 3. Draw Screen Content inside clipped window
    ctx.save();
    roundRectPath(ctx, winX, winY, winW, winH, cornerRadius);
    ctx.clip();

    // Chrome Bar (macOS / browser)
    let contentY = winY;
    let contentH = winH;
    const chromeHeight = 38 * scaleFactor;

    if (settings.windowFrame === 'macos' && winH > chromeHeight * 2) {
      this.drawMacOSChrome(ctx, winX, winY, winW, chromeHeight, scaleFactor);
      contentY += chromeHeight;
      contentH -= chromeHeight;
    } else if (settings.windowFrame === 'browser' && winH > chromeHeight * 2) {
      this.drawBrowserChrome(ctx, winX, winY, winW, chromeHeight, scaleFactor);
      contentY += chromeHeight;
      contentH -= chromeHeight;
    }

    // Apply Cinema LUT color grade
    const profile = CINEMA_PROFILES[settings.cinemaLut] || CINEMA_PROFILES['standard'];
    if (profile.canvasFilter && profile.canvasFilter !== 'none') {
      ctx.filter = profile.canvasFilter;
    }

    const layout = settings.cameraLayout;

    if (layout === 'split-top') {
      // Split Stack: Top is Screen Record, Bottom is Camera Feed
      const halfH = contentH / 2;
      this.drawScreenToRect(ctx, screenElement, winX, contentY, winW, halfH, scaleFactor);
      this.drawCameraToRect(ctx, cameraElement, winX, contentY + halfH, winW, halfH, settings.cameraMirrored, scaleFactor);

      // Clean divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = Math.max(2, 2 * scaleFactor);
      ctx.beginPath();
      ctx.moveTo(winX, contentY + halfH);
      ctx.lineTo(winX + winW, contentY + halfH);
      ctx.stroke();
    } else if (layout === 'split-bottom') {
      // Split Stack: Top is Camera Feed, Bottom is Screen Record
      const halfH = contentH / 2;
      this.drawCameraToRect(ctx, cameraElement, winX, contentY, winW, halfH, settings.cameraMirrored, scaleFactor);
      this.drawScreenToRect(ctx, screenElement, winX, contentY + halfH, winW, halfH, scaleFactor);

      // Clean divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = Math.max(2, 2 * scaleFactor);
      ctx.beginPath();
      ctx.moveTo(winX, contentY + halfH);
      ctx.lineTo(winX + winW, contentY + halfH);
      ctx.stroke();
    } else if (layout === 'split-left') {
      // Split Side-by-Side: Left is Screen Record, Right is Camera Feed
      const halfW = winW / 2;
      this.drawScreenToRect(ctx, screenElement, winX, contentY, halfW, contentH, scaleFactor);
      this.drawCameraToRect(ctx, cameraElement, winX + halfW, contentY, halfW, contentH, settings.cameraMirrored, scaleFactor);

      // Clean divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = Math.max(2, 2 * scaleFactor);
      ctx.beginPath();
      ctx.moveTo(winX + halfW, contentY);
      ctx.lineTo(winX + halfW, contentY + contentH);
      ctx.stroke();
    } else if (layout === 'split-right') {
      // Split Side-by-Side: Left is Camera Feed, Right is Screen Record
      const halfW = winW / 2;
      this.drawCameraToRect(ctx, cameraElement, winX, contentY, halfW, contentH, settings.cameraMirrored, scaleFactor);
      this.drawScreenToRect(ctx, screenElement, winX + halfW, contentY, halfW, contentH, scaleFactor);

      // Clean divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = Math.max(2, 2 * scaleFactor);
      ctx.beginPath();
      ctx.moveTo(winX + halfW, contentY);
      ctx.lineTo(winX + halfW, contentY + contentH);
      ctx.stroke();
    } else if (layout === 'fullscreen') {
      // Solo Camera Fullscreen
      this.drawCameraToRect(ctx, cameraElement, winX, contentY, winW, contentH, settings.cameraMirrored, scaleFactor);
    } else {
      // Standard Screen (+ Optional PiP Camera)
      if (screenElement && screenElement.readyState >= 2) {
        this.drawVideoWithZoom(
          ctx,
          screenElement,
          winX,
          contentY,
          winW,
          contentH,
          this.currentZoom,
          settings.anchorPoint
        );
      } else {
        this.drawScreenStandbyUI(ctx, winX, contentY, winW, contentH, scaleFactor);
      }

      // PiP Overlay
      if (layout !== 'hidden') {
        this.drawCamera(
          ctx,
          settings,
          cameraElement,
          winX,
          contentY,
          winW,
          contentH,
          scaleFactor
        );
      }
    }

    // Reset filter for UI / overlays
    ctx.filter = 'none';

    ctx.restore(); // end window clip

    // 5. Draw Zebras if enabled
    if (settings.zebrasEnabled) {
      drawHighlightZebras(ctx, W, H, settings.zebraThreshold || 242);
    }

    ctx.restore();
  }

  private drawBackdrop(
    ctx: CanvasRenderingContext2D,
    settings: StudioSettings,
    W: number,
    H: number
  ) {
    if (settings.customBackdropUrl) {
      if (this.currentCustomUrl !== settings.customBackdropUrl) {
        this.currentCustomUrl = settings.customBackdropUrl;
        this.customBackdropImg = new Image();
        this.customBackdropImg.src = settings.customBackdropUrl;
      }
      if (this.customBackdropImg && this.customBackdropImg.complete) {
        ctx.drawImage(this.customBackdropImg, 0, 0, W, H);
        return;
      }
    }

    const preset =
      BACKDROP_PRESETS.find((p) => p.id === settings.backdropPreset) || BACKDROP_PRESETS[0];

    if (preset.id === 'amber-sunset') {
      const grad = ctx.createRadialGradient(W / 2, H * 0.1, 50, W / 2, H * 0.1, W * 0.85);
      grad.addColorStop(0, '#4a2408');
      grad.addColorStop(0.5, '#1e0c03');
      grad.addColorStop(1, '#070402');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    } else if (preset.id === 'cyber-teal') {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#042f2e');
      grad.addColorStop(0.5, '#091a24');
      grad.addColorStop(1, '#021210');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    } else if (preset.id === 'neon-dusk') {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#2e0854');
      grad.addColorStop(0.5, '#110e2e');
      grad.addColorStop(1, '#4c0519');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    } else if (preset.id === 'deep-obsidian') {
      const grad = ctx.createRadialGradient(W / 2, H * 0.3, 40, W / 2, H * 0.3, W * 0.75);
      grad.addColorStop(0, '#1e2638');
      grad.addColorStop(0.6, '#0d1117');
      grad.addColorStop(1, '#06080b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    } else if (preset.id === 'velvet-noir') {
      const grad = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, W * 0.7);
      grad.addColorStop(0, '#202024');
      grad.addColorStop(0.6, '#101012');
      grad.addColorStop(1, '#080809');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    } else {
      // Default: ShotOnce Luminous Mesh
      ctx.fillStyle = '#07080a';
      ctx.fillRect(0, 0, W, H);

      // Amber glow top-left
      const amberGlow = ctx.createRadialGradient(W * 0.15, H * 0.15, 0, W * 0.15, H * 0.15, W * 0.55);
      amberGlow.addColorStop(0, 'rgba(229, 169, 60, 0.28)');
      amberGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = amberGlow;
      ctx.fillRect(0, 0, W, H);

      // Teal glow bottom-right
      const tealGlow = ctx.createRadialGradient(W * 0.85, H * 0.85, 0, W * 0.85, H * 0.85, W * 0.55);
      tealGlow.addColorStop(0, 'rgba(20, 184, 166, 0.22)');
      tealGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = tealGlow;
      ctx.fillRect(0, 0, W, H);

      // Subtle center blue pool
      const blueGlow = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.4);
      blueGlow.addColorStop(0, 'rgba(59, 130, 246, 0.12)');
      blueGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = blueGlow;
      ctx.fillRect(0, 0, W, H);
    }

    // Subtle fine noise grid texture overlay
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  private applyShadow(
    ctx: CanvasRenderingContext2D,
    preset: StudioSettings['shadowPreset'],
    scale: number
  ) {
    if (preset === 'soft') {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = 35 * scale;
      ctx.shadowOffsetY = 16 * scale;
    } else if (preset === 'bold') {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.82)';
      ctx.shadowBlur = 60 * scale;
      ctx.shadowOffsetY = 28 * scale;
    } else if (preset === 'amber-glow') {
      ctx.shadowColor = 'rgba(229, 169, 60, 0.45)';
      ctx.shadowBlur = 50 * scale;
      ctx.shadowOffsetY = 0;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    }
  }

  private drawMacOSChrome(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    scale: number
  ) {
    ctx.fillStyle = 'rgba(22, 27, 35, 0.95)';
    ctx.fillRect(x, y, w, h);

    // Traffic light dots
    const dotR = 6 * scale;
    const startX = x + 18 * scale;
    const centerY = y + h / 2;
    const gap = 16 * scale;

    // Red
    ctx.fillStyle = '#ff5f56';
    ctx.beginPath();
    ctx.arc(startX, centerY, dotR, 0, Math.PI * 2);
    ctx.fill();

    // Yellow
    ctx.fillStyle = '#ffbd2e';
    ctx.beginPath();
    ctx.arc(startX + gap, centerY, dotR, 0, Math.PI * 2);
    ctx.fill();

    // Green
    ctx.fillStyle = '#27c93f';
    ctx.beginPath();
    ctx.arc(startX + gap * 2, centerY, dotR, 0, Math.PI * 2);
    ctx.fill();

    // Subtle window title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = `${Math.round(12 * scale)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('ShotOnce Studio Desktop', x + w / 2, centerY + 4 * scale);
  }

  private drawBrowserChrome(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    scale: number
  ) {
    ctx.fillStyle = 'rgba(22, 27, 35, 0.95)';
    ctx.fillRect(x, y, w, h);

    // Pill address bar
    const barW = Math.min(w * 0.45, 450 * scale);
    const barH = 22 * scale;
    const barX = x + (w - barW) / 2;
    const barY = y + (h - barH) / 2;

    roundRectPath(ctx, barX, barY, barW, barH, 6 * scale);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    // Lock icon text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = `${Math.round(11 * scale)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('🔒 shotonce.studio/session', barX + barW / 2, barY + barH / 2 + 4 * scale);
  }

  private drawVideoWithZoom(
    ctx: CanvasRenderingContext2D,
    video: HTMLVideoElement,
    x: number,
    y: number,
    w: number,
    h: number,
    zoom: number,
    anchor: { x: number; y: number }
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    if (zoom <= 1.01) {
      ctx.drawImage(video, x, y, w, h);
    } else {
      // Zoom centered on anchor
      const zW = w * zoom;
      const zH = h * zoom;
      const anchorNormX = anchor.x / 100;
      const anchorNormY = anchor.y / 100;

      const zX = x + w * anchorNormX - zW * anchorNormX;
      const zY = y + h * anchorNormY - zH * anchorNormY;

      ctx.drawImage(video, zX, zY, zW, zH);
    }
    ctx.restore();
  }

  private drawScreenStandbyUI(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    scale: number
  ) {
    ctx.fillStyle = '#07080A';
    ctx.fillRect(x, y, w, h);

    // Subtle optical center crosshair guide
    const cx = x + w / 2;
    const cy = y + h / 2;
    const size = 16 * scale;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - size, cy);
    ctx.lineTo(cx + size, cy);
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx, cy + size);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 6 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  private drawCamera(
    ctx: CanvasRenderingContext2D,
    settings: StudioSettings,
    cameraElement: HTMLVideoElement | null,
    winX: number,
    contentY: number,
    winW: number,
    contentH: number,
    scale: number
  ) {
    const layout = settings.cameraLayout;
    const camScale = (settings.cameraScale || 24) / 100;

    let pipW = Math.round(winW * camScale);
    let pipH = pipW;
    let pipX = winX + (settings.cameraPosition.x / 100) * (winW - pipW);
    let pipY = contentY + (settings.cameraPosition.y / 100) * (contentH - pipH);

    let isCircle = layout === 'circle';
    let borderRadius = isCircle ? pipW / 2 : (settings.cameraBorderRadius || 16) * scale;

    if (layout === 'rounded-pip') {
      pipH = Math.round(pipW * (9 / 16));
      pipY = contentY + (settings.cameraPosition.y / 100) * (contentH - pipH);
    } else if (layout === 'fullscreen') {
      pipX = winX;
      pipY = contentY;
      pipW = winW;
      pipH = contentH;
      borderRadius = 0;
      isCircle = false;
    }

    // PiP drop shadow and amber border glow
    ctx.save();
    if (settings.cameraGlow && layout !== 'fullscreen') {
      ctx.shadowColor = 'rgba(229, 169, 60, 0.4)';
      ctx.shadowBlur = 18 * scale;
    } else {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 24 * scale;
    }

    // Clip camera shape
    roundRectPath(ctx, pipX, pipY, pipW, pipH, borderRadius);
    ctx.fillStyle = '#131518';
    ctx.fill();
    ctx.restore();

    ctx.save();
    roundRectPath(ctx, pipX, pipY, pipW, pipH, borderRadius);
    ctx.clip();

    // Mirroring transform
    if (settings.cameraMirrored) {
      ctx.translate(pipX + pipW, pipY);
      ctx.scale(-1, 1);
      ctx.translate(-pipX, -pipY);
    }

    // Draw camera video feed if active
    if (cameraElement && cameraElement.readyState >= 2) {
      const vW = cameraElement.videoWidth;
      const vH = cameraElement.videoHeight;
      const aspect = vW / vH;
      const pipAspect = pipW / pipH;

      let drawW = pipW;
      let drawH = pipH;
      let drawX = pipX;
      let drawY = pipY;

      if (aspect > pipAspect) {
        drawW = pipH * aspect;
        drawX = pipX - (drawW - pipW) / 2;
      } else {
        drawH = pipW / aspect;
        drawY = pipY - (drawH - pipH) / 2;
      }

      ctx.drawImage(cameraElement, drawX, drawY, drawW, drawH);
    } else {
      ctx.fillStyle = '#131518';
      ctx.fillRect(pipX, pipY, pipW, pipH);
      ctx.fillStyle = '#5C6370';
      ctx.font = `${Math.round(11 * scale)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Camera Inactive', pipX + pipW / 2, pipY + pipH / 2 + 4 * scale);
    }

    ctx.restore();

    // Subtle border outline
    if (layout !== 'fullscreen') {
      ctx.save();
      roundRectPath(ctx, pipX, pipY, pipW, pipH, borderRadius);
      ctx.strokeStyle = settings.cameraGlow ? '#e5a93c' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
      ctx.restore();
    }
  }

  private drawScreenToRect(
    ctx: CanvasRenderingContext2D,
    screenElement: HTMLVideoElement | null,
    x: number,
    y: number,
    w: number,
    h: number,
    scaleFactor: number
  ) {
    if (screenElement && screenElement.readyState >= 2) {
      this.drawVideoCover(ctx, screenElement, x, y, w, h, false);
    } else {
      this.drawScreenStandbyUI(ctx, x, y, w, h, scaleFactor);
    }
  }

  private drawCameraToRect(
    ctx: CanvasRenderingContext2D,
    cameraElement: HTMLVideoElement | null,
    x: number,
    y: number,
    w: number,
    h: number,
    isMirrored: boolean,
    scaleFactor: number
  ) {
    if (cameraElement && cameraElement.readyState >= 2) {
      this.drawVideoCover(ctx, cameraElement, x, y, w, h, isMirrored);
    } else {
      ctx.fillStyle = '#131518';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#5C6370';
      ctx.font = `${Math.round(13 * scaleFactor)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Camera Inactive', x + w / 2, y + h / 2 + 4 * scaleFactor);
    }
  }

  private drawVideoCover(
    ctx: CanvasRenderingContext2D,
    video: HTMLVideoElement,
    x: number,
    y: number,
    w: number,
    h: number,
    mirrored: boolean
  ) {
    const vW = video.videoWidth || 1920;
    const vH = video.videoHeight || 1080;
    const videoAspect = vW / vH;
    const targetAspect = w / h;

    let drawW = w;
    let drawH = h;
    let drawX = x;
    let drawY = y;

    if (videoAspect > targetAspect) {
      drawW = h * videoAspect;
      drawX = x - (drawW - w) / 2;
    } else {
      drawH = w / videoAspect;
      drawY = y - (drawH - h) / 2;
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    if (mirrored) {
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      ctx.translate(-x, -y);
    }

    ctx.drawImage(video, drawX, drawY, drawW, drawH);
    ctx.restore();
  }
}
