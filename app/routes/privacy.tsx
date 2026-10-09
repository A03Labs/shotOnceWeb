import React from 'react';
import { Link } from 'react-router';
import {
  ShieldCheck,
  ArrowLeft,
  Camera,
  Mic,
  Image,
  Lock,
  HardDrive,
  UserX,
  Mail,
  Globe
} from 'lucide-react';
import { Footer } from '../components/Footer';
import type { Route } from './+types/privacy';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy — ShotOnce" },
    {
      name: "description",
      content:
        "Privacy Policy for ShotOnce. All optical processing, derivation rendering, and storage occur 100% locally on your device with zero cloud uploads.",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#07080A] text-[#F3F5F7] selection:bg-[#E5A93C] selection:text-[#0D0E11] py-16 px-6 sm:px-12 font-sans antialiased">
      <div className="max-w-3xl mx-auto text-left">
        {/* Navigation */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#969EAA] hover:text-[#F3F5F7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-4 text-xs font-mono">
            <Link
              to="/terms"
              className="text-[#969EAA] hover:text-[#E5A93C] transition-colors"
            >
              Terms of Use
            </Link>
            <div className="flex items-center gap-2 text-[#10B981]">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>100% On-Device Processing</span>
            </div>
          </div>
        </div>

        {/* Header Block */}
        <div className="p-8 rounded-xl bg-[#131518] mb-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#07080A] shrink-0">
              <img src="/shotonce-icon.png" alt="ShotOnce Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#E5A93C] mb-1">
                Legal Specification
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F5F7] font-['Outfit']">
                Privacy Policy for ShotOnce
              </h1>
              <p className="mt-1 text-xs text-[#969EAA] font-mono">
                Effective Date: October 6, 2026 · Last Updated: October 6, 2026
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-[#969EAA]">
            <div>
              <span className="text-[#5C6370] block">Application:</span>
              <span className="text-[#F3F5F7]">ShotOnce (iOS &amp; Android)</span>
            </div>
            <div>
              <span className="text-[#5C6370] block">Developer:</span>
              <span className="text-[#F3F5F7]">Alabo Excel</span>
            </div>
            <div>
              <span className="text-[#5C6370] block">Website:</span>
              <a href="https://alaboexcel.xyz" target="_blank" rel="noreferrer" className="text-[#E5A93C] hover:underline">
                alaboexcel.xyz
              </a>
            </div>
            <div>
              <span className="text-[#5C6370] block">Contact:</span>
              <a href="mailto:iamalaboexcel@gmail.com" className="text-[#E5A93C] hover:underline">
                iamalaboexcel@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 text-[#969EAA] text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="p-8 rounded-xl bg-[#131518]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              1. Introduction &amp; Core Philosophy
            </h2>
            <p className="mb-3">
              Welcome to <strong className="text-[#F3F5F7]">ShotOnce</strong>. Your privacy is our highest priority.
            </p>
            <p className="mb-3">
              ShotOnce was designed and engineered with a fundamental principle:{' '}
              <span className="text-[#E5A93C] font-medium">
                your creative content belongs to you, and stays on your device
              </span>
              .
            </p>
            <p>
              ShotOnce functions as a standalone optical camera instrument and media derivation studio.{' '}
              <strong className="text-[#F3F5F7]">
                We do not operate remote servers that store, process, or view your photos, videos, audio
                recordings, or teleprompter scripts.
              </strong>{' '}
              All image processing, aspect-ratio cropping, video rendering, color grading, and storage occur{' '}
              <strong className="text-[#10B981]">100% locally on your device</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="p-8 rounded-xl bg-[#131518]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              2. Information We Do NOT Collect
            </h2>
            <p className="mb-4">To be completely transparent:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-lg bg-[#1C2026]">
                <strong className="text-[#F3F5F7] block mb-1">No Account Required</strong>
                <span>You do not need to create an account, log in, or provide an email address, name, or phone number.</span>
              </div>

              <div className="p-4 rounded-lg bg-[#1C2026]">
                <strong className="text-[#F3F5F7] block mb-1">No Cloud Media Uploads</strong>
                <span>Photos and videos captured using ShotOnce are never transmitted to our servers or any cloud infrastructure.</span>
              </div>

              <div className="p-4 rounded-lg bg-[#1C2026]">
                <strong className="text-[#F3F5F7] block mb-1">No Biometric Data</strong>
                <span>ShotOnce does not extract, scan, or store facial recognition, biometric templates, or identity data.</span>
              </div>

              <div className="p-4 rounded-lg bg-[#1C2026]">
                <strong className="text-[#F3F5F7] block mb-1">No Location Tracking or Data Brokers</strong>
                <span>ShotOnce does not request GPS data. We never sell, rent, or trade data to advertising brokers.</span>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="p-8 rounded-xl bg-[#131518]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              3. Device Permissions &amp; Usage
            </h2>
            <p className="mb-4">
              ShotOnce requests only the minimum device permissions strictly required to provide camera and recording functionality:
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-[#1C2026]">
                <div className="flex items-center gap-2 mb-1.5 font-semibold text-[#F3F5F7]">
                  <Camera className="w-4 h-4 text-[#E5A93C]" />
                  <span>3.1 Camera (NSCameraUsageDescription / android.permission.CAMERA)</span>
                </div>
                <p className="text-[#969EAA]">
                  Purpose: To display the real-time optical viewfinder, adjust focus and exposure, apply cinema color grades, and capture master video.
                  Camera data is processed in real time in device RAM and written only to local device storage.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#1C2026]">
                <div className="flex items-center gap-2 mb-1.5 font-semibold text-[#F3F5F7]">
                  <Mic className="w-4 h-4 text-[#E5A93C]" />
                  <span>3.2 Microphone (NSMicrophoneUsageDescription / android.permission.RECORD_AUDIO)</span>
                </div>
                <p className="text-[#969EAA]">
                  Purpose: To record high-fidelity audio alongside your video captures and allow selection of external microphones.
                  Audio is recorded directly into the local file with zero external transmission.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#1C2026]">
                <div className="flex items-center gap-2 mb-1.5 font-semibold text-[#F3F5F7]">
                  <Image className="w-4 h-4 text-[#E5A93C]" />
                  <span>3.3 Photo Library &amp; Media Storage (NSPhotoLibraryUsageDescription / Media Permissions)</span>
                </div>
                <p className="text-[#969EAA]">
                  Purpose: To allow saving rendered aspect-ratio crops (9:16, 1:1, 16:9, 4:5) directly to your device Camera Roll.
                  On iOS, ShotOnce uses Add-Only access without reading existing personal photos.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="p-8 rounded-xl bg-[#131518]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              4. Local Storage &amp; Data Retention
            </h2>
            <ul className="space-y-2 text-xs">
              <li>
                <strong className="text-[#F3F5F7]">Sandboxed Workspace:</strong> All master captures, derived renditions, scripts, and settings are stored exclusively in the app private sandbox directory on your device.
              </li>
              <li>
                <strong className="text-[#F3F5F7]">Data Deletion:</strong> When you delete a photo or video inside ShotOnce, it is immediately and permanently deleted from local disk storage.
              </li>
              <li>
                <strong className="text-[#F3F5F7]">App Uninstallation:</strong> If you uninstall ShotOnce, all sandboxed media and settings stored inside the app are permanently erased by the operating system, unless exported to your system Photos app.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="p-8 rounded-xl bg-[#131518]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              5. Third-Party Services &amp; Payments
            </h2>
            <ul className="space-y-2 text-xs">
              <li>
                <strong className="text-[#F3F5F7]">No Ad Networks:</strong> We do not display third-party advertisements or integrate tracking SDKs.
              </li>
              <li>
                <strong className="text-[#F3F5F7]">In-App Purchases:</strong> Payments are processed directly by Apple (App Store) or Google (Google Play). We never receive, process, or store credit card details.
              </li>
              <li>
                <strong className="text-[#F3F5F7]">System Sharing:</strong> If you share media using the system Share Sheet, that data is handled directly by your selected recipient service.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="p-8 rounded-xl bg-[#131518]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              6. Children Privacy &amp; Legal Rights
            </h2>
            <p className="text-xs">
              ShotOnce does not collect personal information from children or any user, ensuring full compliance with COPPA and GDPR.
              Under international data privacy frameworks (GDPR, CCPA, CPRA), you retain complete and exclusive ownership and physical control of all your data at all times.
            </p>
          </section>

          {/* Section 7: Contact */}
          <section className="p-8 rounded-xl bg-[#131518]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              7. Contact Us
            </h2>
            <p className="mb-4 text-xs">
              If you have any questions regarding this Privacy Policy or ShotOnce privacy practices:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
             
              <a href="mailto:iamalaboexcel@gmail.com" className="p-3 rounded-lg bg-[#1C2026] hover:bg-[#262B33] flex items-center gap-3 transition-colors">
                <Mail className="w-4 h-4 text-[#E5A93C]" />
                <span>iamalaboexcel@gmail.com</span>
              </a>

              <a href="https://alaboexcel.xyz" target="_blank" rel="noreferrer" className="p-3 rounded-lg bg-[#1C2026] hover:bg-[#262B33] flex items-center gap-3 transition-colors">
                <Globe className="w-4 h-4 text-[#10B981]" />
                <span>alaboexcel.xyz</span>
              </a>

              <div className="p-3 col-span-2 rounded-lg bg-[#1C2026] flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#E5A93C]" />
                <span>Developer: Alabo Excel</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Navigation & Copyright */}
        <Footer variant="contained" />
      </div>
    </div>
  );
}
