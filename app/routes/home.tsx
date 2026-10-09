import React, { useState } from 'react';
import { Link } from 'react-router';
import {
  Monitor,
  Smartphone,
  Apple,
  ArrowRight,
  X,
  ExternalLink,
  ShieldCheck,
  Video,
  Sparkles,
} from 'lucide-react';
import { Footer } from '../components/Footer';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ShotOnce — Dual-Source Split Screen Recording Studio" },
    {
      name: "description",
      content:
        "Pro optical camera instrument & desktop studio. Dual-source split screen video recording (top/bottom, left/right) and PiP, with eye-line teleprompter, curated framing, and 100% on-device processing.",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
}

export default function Home() {
  const [downloadModalPlatform, setDownloadModalPlatform] = useState<'ios' | 'android' | null>(null);

  return (
    <div className="min-h-screen bg-[#07080A] text-[#F3F5F7] font-sans antialiased selection:bg-[#E5A93C] selection:text-[#0D0E11]">
      {/* ================= NAVIGATION ================= */}
      <header className="w-full bg-[#07080A]/80 backdrop-blur-md sticky top-0 z-40 border-b border-[#181B22] px-6 sm:px-12 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#131518] border border-[#262B33] shrink-0 transition-transform group-hover:scale-105">
              <img src="/shotonce-icon.png" alt="ShotOnce" className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-[#F3F5F7] font-['Outfit']">
              ShotOnce
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#969EAA]">
            <a href="#capabilities" className="hover:text-[#F3F5F7] transition-colors">
              Capabilities
            </a>
            <a href="#platforms" className="hover:text-[#F3F5F7] transition-colors">
              Platforms
            </a>
            <Link to="/terms" className="hover:text-[#F3F5F7] transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-[#F3F5F7] transition-colors">
              Privacy
            </Link>
          </nav>

          {/* CTA Action */}
          <div className="flex items-center gap-3">
            <Link
              to="/studio"
              className="px-4 py-2 rounded-lg text-xs font-bold bg-[#E5A93C] hover:bg-[#FFB834] text-[#0D0E11] flex items-center gap-1.5 transition-all shadow-sm hover:shadow-[#E5A93C]/20"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Open Studio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative pt-20 sm:pt-28 pb-20 sm:pb-28 px-6 sm:px-12 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Subtle Ambient Backlight Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-full h-[320px] bg-[#E5A93C]/5 blur-[130px] rounded-full pointer-events-none -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131518] border border-[#262B33] text-xs font-mono text-[#E5A93C] mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C] animate-pulse" />
          <span>Dual-Source Split Screen Recording</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F3F5F7] font-['Outfit'] leading-[1.08] max-w-4xl">
         Record Screen &amp; face. Perfectly split.
        </h1>

        {/* Description */}
        <p className="mt-6 text-base sm:text-lg text-[#969EAA] leading-relaxed max-w-2xl mx-auto">
          Record your screen demo and camera video together in a clean 50/50 split — top and bottom,
          or left and right. Swap feeds on the fly or toggle to a floating camera bubble. All encoded
          locally in high-definition without cloud lag.
        </p>

        {/* Actions */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/studio"
            className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-[#E5A93C] hover:bg-[#FFB834] text-[#0D0E11] flex items-center gap-2 shadow-lg shadow-[#E5A93C]/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Monitor className="w-4 h-4" />
            <span>Launch Web Studio</span>
          </Link>

          <button
            onClick={() => setDownloadModalPlatform('ios')}
            className="px-5 py-3.5 rounded-xl text-xs sm:text-sm font-medium bg-[#131518] hover:bg-[#1C2026] text-[#F3F5F7] border border-[#262B33] flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Apple className="w-4 h-4" />
            <span>iOS</span>
          </button>

          <button
            onClick={() => setDownloadModalPlatform('android')}
            className="px-5 py-3.5 rounded-xl text-xs sm:text-sm font-medium bg-[#131518] hover:bg-[#1C2026] text-[#F3F5F7] border border-[#262B33] flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Smartphone className="w-4 h-4 text-[#10B981]" />
            <span>Android</span>
          </button>
        </div>

        {/* Quiet Trust Line */}
        <div className="mt-8 text-xs font-mono text-[#5C6370]">
          Zero cloud uploads • 100% on-device processing • No account required
        </div>
      </section>

      {/* ================= CAPABILITIES (UNIFIED & INTENTIONAL) ================= */}
      <section id="capabilities" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto border-t border-[#181B22]">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F3F5F7] font-['Outfit']">
            Engineered for seamless screencasting.
          </h2>
          <p className="mt-3 text-sm text-[#969EAA] leading-relaxed">
            No cloud queues, no heavy background daemons, and zero subscription gating. Everything renders and encodes straight from your local hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Dual Stream Compositor */}
          <div className="p-6 rounded-xl bg-[#0F1116] border border-[#1E222A] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/10 text-[#E5A93C] flex items-center justify-center mb-4">
                <Video className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-2">
                GPU hardware compositing
              </h3>
              <p className="text-xs text-[#969EAA] leading-relaxed">
                Merges your desktop screen share and camera feed in real-time at 60 frames per second. Video and microphone audio remain locked in sync with zero drift.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-[#5C6370]">WebCodecs &amp; WebGL Engine</div>
          </div>

          {/* 2. Multi-Aspect Derivations */}
          <div className="p-6 rounded-xl bg-[#0F1116] border border-[#1E222A] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/10 text-[#E5A93C] flex items-center justify-center mb-4">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-2">
                Single take, multi-aspect export
              </h3>
              <p className="text-xs text-[#969EAA] leading-relaxed">
                Record once on your desktop. Derive widescreen 16:9 for YouTube walkthroughs and vertical 9:16 for Reels and TikTok simultaneously without re-shooting.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-[#5C6370]">16:9 • 9:16 • 1:1 • 4:5</div>
          </div>

          {/* 3. 100% On-Device Privacy */}
          <div className="p-6 rounded-xl bg-[#0F1116] border border-[#1E222A] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mb-4">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-2">
                Absolute on-device privacy
              </h3>
              <p className="text-xs text-[#969EAA] leading-relaxed">
                Your camera, microphone, and proprietary code never touch an external server. Video files encode straight to your local disk with instant availability.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-[#10B981]">100% Client-Side Processing</div>
          </div>
        </div>
      </section>

      {/* ================= PLATFORMS: DESKTOP & MOBILE ================= */}
      <section id="platforms" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto border-t border-[#181B22]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Web Studio */}
          <div className="p-8 rounded-xl bg-[#0F1116] border border-[#1E222A] flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#E5A93C] mb-2">Browser Studio</div>
              <h3 className="text-2xl font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
                Web Recording Studio
              </h3>
              <p className="text-sm text-[#969EAA] leading-relaxed mb-6">
                Direct in-browser studio with real-time teleprompter, framing presets, and high-bitrate local disk exports. No installation or setup required.
              </p>
            </div>

            <div>
              <Link
                to="/studio"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-bold bg-[#E5A93C] hover:bg-[#FFB834] text-[#0D0E11] transition-all hover:scale-[1.01]"
              >
                <span>Launch Web Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Mobile Companion */}
          <div className="p-8 rounded-xl bg-[#0F1116] border border-[#1E222A] flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#E5A93C] mb-2">Mobile Instrument</div>
              <h3 className="text-2xl font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
                iOS &amp; Android Apps
              </h3>
              <p className="text-sm text-[#969EAA] leading-relaxed mb-6">
                Calibrated optical camera instrument with manual shutter controls, zebra exposure guides, and USB-C microphone support.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDownloadModalPlatform('ios')}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#161920] hover:bg-[#20242E] text-[#F3F5F7] border border-[#262B34] flex items-center gap-2 transition-colors"
              >
                <Apple className="w-4 h-4" />
                <span>App Store</span>
              </button>
              <button
                onClick={() => setDownloadModalPlatform('android')}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#161920] hover:bg-[#20242E] text-[#F3F5F7] border border-[#262B34] flex items-center gap-2 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-[#10B981]" />
                <span>Google Play</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />

      {/* ================= DOWNLOAD MODAL ================= */}
      {downloadModalPlatform && (
        <div className="fixed inset-0 z-50 bg-[#07080A]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#131518] border border-[#262B33] rounded-xl p-6 text-left shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#07080A] border border-[#262B33]">
                  <img src="/shotonce-icon.png" alt="ShotOnce" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-[#F3F5F7] text-sm font-['Outfit']">
                    ShotOnce for {downloadModalPlatform === 'ios' ? 'iOS' : 'Android'}
                  </h3>
                  <span className="text-[11px] font-mono text-[#969EAA]">
                    {downloadModalPlatform === 'ios' ? 'App Store' : 'Google Play'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setDownloadModalPlatform(null)}
                className="p-1.5 rounded text-[#969EAA] hover:text-[#F3F5F7] hover:bg-[#1C2026]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#969EAA] leading-relaxed mb-6">
              ShotOnce mobile camera instruments are rolling out on {downloadModalPlatform === 'ios' ? 'the App Store' : 'Google Play'}.
              In the meantime, the full Web Studio is live right now in your browser with zero installation.
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <a
                href={downloadModalPlatform === 'ios' ? 'https://apps.apple.com' : 'https://play.google.com'}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-lg font-semibold bg-[#F3F5F7] text-[#0D0E11] hover:bg-white flex items-center justify-center gap-2 transition-colors"
              >
                <span>Open {downloadModalPlatform === 'ios' ? 'App Store' : 'Google Play'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Link
                to="/studio"
                onClick={() => setDownloadModalPlatform(null)}
                className="w-full py-2.5 rounded-lg font-semibold bg-[#1C2026] hover:bg-[#262B33] text-[#F3F5F7] flex items-center justify-center gap-2 transition-colors"
              >
                <Monitor className="w-4 h-4 text-[#E5A93C]" />
                <span>Launch Web Studio</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
