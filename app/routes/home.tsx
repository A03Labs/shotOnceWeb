import React, { useState } from 'react';
import { Link } from 'react-router';
import {
  Monitor,
  Smartphone,
  Apple,
  X,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
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
      <header className="w-full bg-[#07080A] py-5 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#131518] shrink-0">
              <img src="/shotonce-icon.png" alt="ShotOnce" className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-[#F3F5F7] font-['Outfit']">
              ShotOnce
            </span>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#969EAA]">
            <a href="#layouts" className="hover:text-[#F3F5F7] transition-colors">
              Split Layouts
            </a>
            <a href="#apps" className="hover:text-[#F3F5F7] transition-colors">
              Mobile App
            </a>
            <Link to="/studio" className="hover:text-[#F3F5F7] transition-colors">
              Web Studio
            </Link>
            <Link to="/privacy" className="hover:text-[#F3F5F7] transition-colors">
              Privacy
            </Link>
          </nav>

          {/* Primary Action */}
          <div className="flex items-center gap-3">
            <Link
              to="/studio"
              className="px-4 py-2 rounded-lg text-xs font-bold bg-[#E5A93C] hover:bg-[#FFB834] text-[#0D0E11] transition-colors"
            >
              Open Studio
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative pt-20 sm:pt-28 pb-24 sm:pb-32 px-6 sm:px-12 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Subtle Ambient Backlight Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] max-w-full h-[320px] bg-[#E5A93C]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131518] border border-[#262B33] text-xs font-mono text-[#E5A93C] mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C] animate-pulse" />
          <span>Dual-Source Split Screen Recording</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F3F5F7] font-['Outfit'] leading-[1.08] max-w-4xl">
          Screen &amp; face. Perfectly split.
        </h1>

        {/* Subtitle / Description */}
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

        {/* Note */}
        <div className="mt-8 text-xs font-mono text-[#5C6370]">
          Zero cloud uploads • 100% on-device processing • No account required
        </div>
      </section>

      {/* ================= SPLIT LAYOUTS SECTION ================= */}
      <section id="layouts" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="text-left max-w-xl mb-12">
          <div className="text-xs font-mono text-[#E5A93C] mb-2">Dual-Source Compositing</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F3F5F7] font-['Outfit']">
            Split screens for any storytelling style.
          </h2>
          <p className="mt-3 text-sm text-[#969EAA] leading-relaxed">
            Present code, design workflows, or video walkthroughs with both your screen and camera feed
            rendered simultaneously in real-time. Switch layouts instantly without pausing your recording.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {/* Top / Bottom */}
          <div className="p-6 rounded-xl bg-[#131518] flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#E5A93C] mb-3">TOP / BOTTOM</div>
              <h3 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-2">
                Screen Top · Camera Bottom
              </h3>
              <p className="text-xs text-[#969EAA] leading-relaxed">
                Clean 50% horizontal partition. Prioritizes your wide software workspace on top with your
                presenter reaction view underneath.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-[#5C6370]">Tutorials &amp; Live Coding</div>
          </div>

          {/* Bottom / Top */}
          <div className="p-6 rounded-xl bg-[#1C2026] flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#E5A93C] mb-3">BOTTOM / TOP</div>
              <h3 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-2">
                Camera Top · Screen Bottom
              </h3>
              <p className="text-xs text-[#969EAA] leading-relaxed">
                Eye-line presenter lead. Perfect for high-engagement keynote intros, customer feedback reviews,
                and lecture walkthroughs.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-[#E5A93C]">Keynotes &amp; Direct Talks</div>
          </div>

          {/* Left / Right */}
          <div className="p-6 rounded-xl bg-[#131518] flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#E5A93C] mb-3">SIDE-BY-SIDE</div>
              <h3 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-2">
                Screen Left · Camera Right
              </h3>
              <p className="text-xs text-[#969EAA] leading-relaxed">
                Vertical 50% split. Balances your desktop window with an uncropped full-height camera portrait
                for natural pair-programming feel.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-[#5C6370]">Side-by-Side Demos</div>
          </div>

          {/* Card 3: Round Floating Cam */}
          <div className="p-6 rounded-xl bg-[#131518] flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#E5A93C] mb-3">ROUND FLOATING CAM</div>
              <h3 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-2">
                Full Screen · Round Cam
              </h3>
              <p className="text-xs text-[#969EAA] leading-relaxed">
                Full-width screen recording with a circular presenter camera floating cleanly on either the left or right side.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-[#5C6370]">Keynotes &amp; Demos</div>
          </div>

          {/* Card 4: Square Floating Cam */}
          <div className="p-6 rounded-xl bg-[#131518] flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#E5A93C] mb-3">SQUARE FLOATING CAM</div>
              <h3 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-2">
                Full Screen · Square Cam
              </h3>
              <p className="text-xs text-[#969EAA] leading-relaxed">
                Full-width screen recording with a modern rounded squircle camera floating on either the left or right side.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-[#5C6370]">Modern Screencasts</div>
          </div>
        </div>
      </section>

      {/* ================= PLATFORMS: MOBILE & WEB ================= */}
      <section id="apps" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          {/* Mobile Instrument Card */}
          <div className="p-8 rounded-xl bg-[#131518] flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#E5A93C] mb-2">iOS &amp; Android</div>
              <h3 className="text-2xl font-bold text-[#F3F5F7] font-['Outfit'] mb-4">
                Mobile Camera Instrument
              </h3>
              <p className="text-sm text-[#969EAA] leading-relaxed mb-6">
                Turn your phone into a calibrated camera instrument. Full hardware sensor control with
                ProRes/Camera2, manual shutter angles, zebra exposure guides, and stereo audio monitors.
              </p>

              <div className="space-y-2 text-xs font-mono text-[#969EAA] mb-8">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
                  <span>ProRes Log and Cinema Warm 3200K profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
                  <span>External USB-C and Bluetooth microphone support</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
                  <span>Add-Only direct camera roll export permissions</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDownloadModalPlatform('ios')}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#1C2026] hover:bg-[#262B33] text-[#F3F5F7] flex items-center gap-2 transition-colors"
              >
                <Apple className="w-4 h-4" />
                <span>App Store</span>
              </button>
              <button
                onClick={() => setDownloadModalPlatform('android')}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#1C2026] hover:bg-[#262B33] text-[#F3F5F7] flex items-center gap-2 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-[#10B981]" />
                <span>Google Play</span>
              </button>
            </div>
          </div>

          {/* Web Studio Card */}
          <div className="p-8 rounded-xl bg-[#131518] flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#E5A93C] mb-2">Desktop Browser</div>
              <h3 className="text-2xl font-bold text-[#F3F5F7] font-['Outfit'] mb-4">
                Web Recording Studio
              </h3>
              <p className="text-sm text-[#969EAA] leading-relaxed mb-6">
                Record your screen and webcam together in a clean 50/50 split (top/bottom or left/right).
                Zero clutter, instant in-browser recording, and direct video export to disk.
              </p>

              <div className="space-y-2 text-xs font-mono text-[#969EAA] mb-8">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
                  <span>Simultaneous screen sharing &amp; camera feed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
                  <span>Split-screen layouts: top/bottom &amp; left/right</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
                  <span>100% on-device processing with zero cloud delay</span>
                </div>
              </div>
            </div>

            <div>
              <Link
                to="/studio"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#E5A93C] hover:bg-[#FFB834] text-[#0D0E11] transition-colors"
              >
                <span>Launch Web Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRIVACY BANNER ================= */}
      <section className="py-16 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="p-8 rounded-xl bg-[#131518] text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="text-xs font-mono text-[#10B981] mb-1">Local Processing Guarantee</div>
            <h4 className="text-lg font-bold text-[#F3F5F7] font-['Outfit']">
              Your media stays on your device. Always.
            </h4>
            <p className="text-xs text-[#969EAA] mt-1 leading-relaxed">
              ShotOnce does not operate media processing servers. All compositing, cropping, and encoding run
              locally in device memory and save to your local disk.
            </p>
          </div>

          <Link
            to="/privacy"
            className="px-4 py-2 rounded-lg text-xs font-medium bg-[#1C2026] hover:bg-[#262B33] text-[#F3F5F7] shrink-0 transition-colors"
          >
            Read Privacy Policy
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-12 px-6 sm:px-12 max-w-6xl mx-auto text-xs text-[#5C6370]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded overflow-hidden bg-[#131518]">
              <img src="/shotonce-icon.png" alt="ShotOnce" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-[#F3F5F7]">ShotOnce</span>
            <span>• Alabo Excel</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <Link to="/studio" className="hover:text-[#F3F5F7] transition-colors">
              Web Studio
            </Link>
            <Link to="/privacy" className="hover:text-[#F3F5F7] transition-colors">
              Privacy Policy
            </Link>
            <a
              href="https://alaboexcel.xyz"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#F3F5F7] transition-colors"
            >
              alaboexcel.xyz
            </a>
          </div>
        </div>
      </footer>

      {/* ================= MINIMAL DOWNLOAD MODAL ================= */}
      {downloadModalPlatform && (
        <div className="fixed inset-0 z-50 bg-[#07080A]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#131518] rounded-xl p-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#07080A]">
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
              ShotOnce is deploying to {downloadModalPlatform === 'ios' ? 'the App Store' : 'Google Play'}.
              You can also use the full Web Studio right in your browser with zero installation.
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <a
                href={downloadModalPlatform === 'ios' ? 'https://apps.apple.com' : 'https://play.google.com'}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-lg font-semibold bg-[#F3F5F7] text-[#0D0E11] hover:bg-white flex items-center justify-center gap-2"
              >
                <span>Open {downloadModalPlatform === 'ios' ? 'App Store' : 'Google Play'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Link
                to="/studio"
                onClick={() => setDownloadModalPlatform(null)}
                className="w-full py-2.5 rounded-lg font-semibold bg-[#1C2026] hover:bg-[#262B33] text-[#F3F5F7] flex items-center justify-center gap-2"
              >
                <Monitor className="w-4 h-4 text-[#E5A93C]" />
                <span>Open Web Studio Instead</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
