import React from 'react';
import { Link } from 'react-router';
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  Scale,
  Video,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Mail,
  Globe,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { Footer } from '../components/Footer';
import type { Route } from './+types/terms';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Terms of Use — ShotOnce" },
    {
      name: "description",
      content:
        "Terms of Use for ShotOnce dual-source screencasting studio and mobile camera instruments. Clear terms covering local processing, complete content ownership, and user responsibilities.",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
}

export default function TermsOfUse() {
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
              to="/privacy"
              className="text-[#969EAA] hover:text-[#E5A93C] transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Privacy Policy</span>
            </Link>
            <div className="flex items-center gap-2 text-[#E5A93C]">
              <span className="w-2 h-2 rounded-full bg-[#E5A93C]" />
              <span>Binding Legal Agreement</span>
            </div>
          </div>
        </div>

        {/* Header Block */}
        <div className="p-8 rounded-xl bg-[#131518] mb-10 border border-[#1E222A]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#07080A] shrink-0 border border-[#262B33]">
              <img src="/shotonce-icon.png" alt="ShotOnce Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#E5A93C] mb-1">
                Legal Specification &amp; User Agreement
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F5F7] font-['Outfit']">
                Terms of Use for ShotOnce
              </h1>
              <p className="mt-1 text-xs text-[#969EAA] font-mono">
                Effective Date: October 9, 2026 · Last Updated: October 9, 2026
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#1E222A] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-[#969EAA]">
            <div>
              <span className="text-[#5C6370] block">Application:</span>
              <span className="text-[#F3F5F7]">ShotOnce (Web &amp; Mobile)</span>
            </div>
            <div>
              <span className="text-[#5C6370] block">Developer:</span>
              <span className="text-[#F3F5F7]">Alabo Excel</span>
            </div>
            <div>
              <span className="text-[#5C6370] block">Architecture:</span>
              <span className="text-[#10B981]">100% On-Device</span>
            </div>
            <div>
              <span className="text-[#5C6370] block">Contact:</span>
              <a href="mailto:iamalaboexcel@gmail.com" className="text-[#E5A93C] hover:underline">
                iamalaboexcel@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Key Guarantees Summary */}
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-lg bg-[#131518] border border-[#1E222A]">
            <div className="flex items-center gap-2 mb-1.5 font-semibold text-[#F3F5F7]">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Full Content Ownership</span>
            </div>
            <p className="text-[#969EAA] leading-relaxed">
              Every video, audio recording, screen capture, and derived asset you produce belongs 100% to you. We claim zero intellectual property or distribution rights over your creations.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#131518] border border-[#1E222A]">
            <div className="flex items-center gap-2 mb-1.5 font-semibold text-[#F3F5F7]">
              <Cpu className="w-4 h-4 text-[#E5A93C]" />
              <span>Local Hardware Execution</span>
            </div>
            <p className="text-[#969EAA] leading-relaxed">
              ShotOnce runs client-side in your browser and on your device. Video frames never leave your hardware, preventing remote server leaks or external interception.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#131518] border border-[#1E222A]">
            <div className="flex items-center gap-2 mb-1.5 font-semibold text-[#F3F5F7]">
              <Lock className="w-4 h-4 text-[#10B981]" />
              <span>No Account or Lock-in</span>
            </div>
            <p className="text-[#969EAA] leading-relaxed">
              Use the studio immediately without creating accounts, providing passwords, or surrendering personal credentials. You can export directly to your local file system.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#131518] border border-[#1E222A]">
            <div className="flex items-center gap-2 mb-1.5 font-semibold text-[#F3F5F7]">
              <Scale className="w-4 h-4 text-[#E5A93C]" />
              <span>Responsible Recording</span>
            </div>
            <p className="text-[#969EAA] leading-relaxed">
              You are responsible for obtaining proper consent when recording other individuals, proprietary screen content, or confidential information.
            </p>
          </div>
        </div>

        {/* Terms Body */}
        <div className="space-y-8 text-[#969EAA] text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="p-8 rounded-xl bg-[#131518] border border-[#1E222A]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              1. Acceptance of Terms &amp; Eligibility
            </h2>
            <p className="mb-3">
              These Terms of Use (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;you&rdquo;, or &ldquo;your&rdquo;) and <strong className="text-[#F3F5F7]">Alabo Excel</strong> (&ldquo;Developer&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), governing your access to and use of <strong className="text-[#F3F5F7]">ShotOnce</strong>, including the ShotOnce Web Studio, web applications, and mobile applications for iOS and Android (collectively, the &ldquo;Service&rdquo;).
            </p>
            <p className="mb-3">
              By accessing, browsing, launching, or using ShotOnce, you acknowledge that you have read, understood, and agree to be bound by these Terms and our companion <Link to="/privacy" className="text-[#E5A93C] hover:underline">Privacy Policy</Link>. If you do not agree with any portion of these Terms, you must immediately discontinue use of the Service.
            </p>
            <p>
              You affirm that you are at least 13 years old (or the legal age of majority in your jurisdiction) and possess full legal capacity to enter into these Terms. If you are using ShotOnce on behalf of an entity, company, or educational organization, you represent and warrant that you have authority to bind that entity to these Terms.
            </p>
          </section>

          {/* Section 2 */}
          <section className="p-8 rounded-xl bg-[#131518] border border-[#1E222A]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              2. Description of the Service &amp; Local Architecture
            </h2>
            <p className="mb-3">
              ShotOnce is an optical dual-source screencasting instrument, screen recording compositor, and media derivation studio designed for video creators, developers, educators, and storytellers. Key capabilities include:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4 text-xs">
              <li>Dual-stream compositing (simultaneous screen capture and camera viewfinder in split-screen or floating modes).</li>
              <li>Real-time hardware-accelerated video rendering and audio synchronization via standard web and native APIs.</li>
              <li>Teleprompter text display and aspect-ratio derivations (16:9, 9:16, 1:1, 4:5).</li>
              <li>Local high-definition video export and client-side ZIP packaging.</li>
            </ul>
            <p>
              <strong className="text-[#F3F5F7]">Local-First Operation:</strong> The Service operates client-side on your local device. We do not maintain cloud servers that receive, buffer, process, or archive your video feeds or screen contents. Your browser or mobile device performs all rendering directly.
            </p>
          </section>

          {/* Section 3 */}
          <section className="p-8 rounded-xl bg-[#131518] border border-[#1E222A]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              3. User Content &amp; Absolute Ownership
            </h2>
            <p className="mb-3">
              You retain sole and exclusive ownership of all content, footage, video recordings, audio tracks, still images, screen captures, and script text that you create, import, or generate using ShotOnce (&ldquo;User Content&rdquo;).
            </p>
            <div className="p-4 rounded-lg bg-[#1C2026] text-xs space-y-2 mb-3">
              <div className="text-[#F3F5F7] font-semibold">Our Pledge Regarding Your Creations:</div>
              <p>• We do NOT claim any copyright, trademark, or intellectual property rights in your User Content.</p>
              <p>• We do NOT require, take, or store any license to view, distribute, sell, or monetize your recordings.</p>
              <p>• Because recordings reside exclusively on your machine, you maintain sole custody and control at all times.</p>
            </div>
            <p className="text-xs">
              You are solely responsible for all User Content you capture, export, or publish, ensuring you hold all necessary licenses, permissions, and rights to distribute or display such material.
            </p>
          </section>

          {/* Section 4 */}
          <section className="p-8 rounded-xl bg-[#131518] border border-[#1E222A]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              4. Software License &amp; Intellectual Property
            </h2>
            <p className="mb-3">
              Subject to your ongoing compliance with these Terms, Alabo Excel grants you a limited, revocable, non-exclusive, non-transferable, non-sublicensable license to access and use the ShotOnce software solely for your personal, creative, educational, or commercial video production purposes.
            </p>
            <p className="mb-3">
              <strong className="text-[#F3F5F7]">Proprietary Rights:</strong> The ShotOnce interface, visual design, icons, logos, source code, shaders, styles, algorithms, and documentation are the intellectual property of Alabo Excel and are protected by applicable copyright, trademark, and trade secret laws.
            </p>
            <p className="text-xs">
              You may not modify, reverse engineer, decompile, disassemble, extract source code from compiled binaries, or create unauthorized derivative works of the ShotOnce software application itself, except where such restriction is prohibited by applicable mandatory law.
            </p>
          </section>

          {/* Section 5 */}
          <section className="p-8 rounded-xl bg-[#131518] border border-[#1E222A]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              5. Acceptable Use &amp; Prohibited Conduct
            </h2>
            <p className="mb-4">
              When utilizing ShotOnce, you agree to adhere to all applicable local, national, and international laws. Specifically, you agree NOT to:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-lg bg-[#1C2026]">
                <strong className="text-[#F3F5F7] block mb-1">5.1 Unlawful or Non-Consensual Recording</strong>
                <span>Record individuals, conversations, communications, or private spaces without required two-party or multi-party legal consent under applicable eavesdropping, wiretapping, or privacy statutes.</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#1C2026]">
                <strong className="text-[#F3F5F7] block mb-1">5.2 Infringement of Intellectual Property</strong>
                <span>Capture, record, or distribute copyrighted video, audio, software, or trademarked material belonging to third parties without authorization or fair use exemption.</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#1C2026]">
                <strong className="text-[#F3F5F7] block mb-1">5.3 Malicious Disruption or Exploitation</strong>
                <span>Attempt to disable, overload, or impair the delivery of the web application, introduce malicious code, viruses, or automated scraping scripts against ShotOnce web infrastructure.</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#1C2026]">
                <strong className="text-[#F3F5F7] block mb-1">5.4 Unlawful or Harmful Content Generation</strong>
                <span>Utilize the software to create defamatory, fraudulent, harassing, obscene, abusive, or explicitly illegal media.</span>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="p-8 rounded-xl bg-[#131518] border border-[#1E222A]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              6. Hardware, System Permissions &amp; Performance
            </h2>
            <p className="mb-3">
              ShotOnce utilizes standard browser APIs (such as <code className="text-[#E5A93C] font-mono text-xs">navigator.mediaDevices.getUserMedia</code>, the Screen Capture API, HTML5 Canvas, WebGL, Web Audio, and <code className="text-[#E5A93C] font-mono text-xs">MediaRecorder</code>).
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs mb-3">
              <li>
                <strong className="text-[#F3F5F7]">Permissions:</strong> You must explicitly grant your operating system and browser permission to access your camera, microphone, or display feed. You can revoke these permissions at any time through your browser or device system settings.
              </li>
              <li>
                <strong className="text-[#F3F5F7]">Hardware Limitations:</strong> Video encoding performance, frame rates (FPS), resolution, and audio fidelity depend entirely on your device processing power, GPU acceleration, and available RAM. We are not liable for dropped frames or recording hiccups resulting from insufficient hardware resources.
              </li>
              <li>
                <strong className="text-[#F3F5F7]">Data Archiving:</strong> ShotOnce is an instrument, not a cloud storage provider. You are solely responsible for downloading, verifying, and backing up your exported video files. Once a browser tab or session is closed without saving, unsaved live memory buffers are discarded and cannot be recovered.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="p-8 rounded-xl bg-[#131518] border border-[#1E222A]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              7. Third-Party Platforms, App Stores &amp; Links
            </h2>
            <p className="mb-3 text-xs">
              When downloading or using ShotOnce mobile versions via third-party application marketplaces (including Apple App Store or Google Play Store), you acknowledge that your use is additionally governed by the respective terms of service and end-user license agreements of those marketplaces.
            </p>
            <p className="text-xs">
              ShotOnce may provide links to external websites (such as developer portfolios, developer documentation, or social platforms). We do not control and are not responsible for the content, privacy policies, or practices of any third-party websites or services.
            </p>
          </section>

          {/* Section 8 */}
          <section className="p-8 rounded-xl bg-[#131518] border border-[#1E222A]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              8. Disclaimer of Warranties
            </h2>
            <p className="mb-3 text-xs leading-relaxed uppercase tracking-wider font-mono text-[#E5A93C]">
              PLEASE READ CAREFULLY:
            </p>
            <p className="text-xs mb-3">
              THE SERVICE IS PROVIDED ON AN <strong className="text-[#F3F5F7]">&ldquo;AS IS&rdquo;</strong> AND <strong className="text-[#F3F5F7]">&ldquo;AS AVAILABLE&rdquo;</strong> BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, ALABO EXCEL AND AFFILIATES DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</li>
              <li>WARRANTIES THAT THE SERVICE WILL FUNCTION UNINTERRUPTED, SECURELY, OR ERROR-FREE.</li>
              <li>WARRANTIES THAT RECORDED FOOTAGE OR AUDIO CAPTURE WILL BE FREE FROM CORRUPTION, DROPPED FRAMES, OR SYSTEM CRASHES CAUSED BY BROWSER ENVIRONMENT OR HARDWARE CONSTRAINTS.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="p-8 rounded-xl bg-[#131518] border border-[#1E222A]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              9. Limitation of Liability
            </h2>
            <p className="text-xs mb-3">
              TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL ALABO EXCEL, ITS DEVELOPERS, AFFILIATES, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs mb-3">
              <li>LOSS OF RECORDED FOOTAGE, DATA, OR MEDIA CONTENT;</li>
              <li>LOSS OF PROFITS, REVENUE, GOODWILL, OR BUSINESS OPPORTUNITY;</li>
              <li>DEVICE MALFUNCTION, OVERHEATING, OR HARDWARE STRAIN RESULTING FROM RECORDING COMPOSITING;</li>
              <li>ANY ISSUES ARISING FROM YOUR DISTRIBUTION OR BROADCAST OF USER CONTENT.</li>
            </ul>
            <p className="text-xs">
              IN NO EVENT SHALL OUR TOTAL CUMULATIVE LIABILITY EXCEED THE AMOUNT PAID BY YOU TO USE SHOTONCE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR FIFTY UNITED STATES DOLLARS ($50.00 USD), WHICHEVER IS GREATER.
            </p>
          </section>

          {/* Section 10 */}
          <section className="p-8 rounded-xl bg-[#131518] border border-[#1E222A]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              10. Indemnification
            </h2>
            <p className="text-xs">
              You agree to defend, indemnify, and hold harmless Alabo Excel and its contractors from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys&apos; fees) arising out of or in any way connected with: (a) your use of ShotOnce; (b) any User Content you capture, store, or share; (c) your violation of these Terms; or (d) your infringement or violation of any rights of another person or entity.
            </p>
          </section>

          {/* Section 11 */}
          <section className="p-8 rounded-xl bg-[#131518] border border-[#1E222A]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              11. Termination &amp; Cessation of Use
            </h2>
            <p className="text-xs mb-3">
              You are free to stop using ShotOnce at any time by simply closing the web application in your browser or uninstalling the mobile application from your device.
            </p>
            <p className="text-xs">
              We reserve the right to modify, suspend, or discontinue the web service or any feature at any time without prior notice. Sections concerning Intellectual Property, Ownership, Disclaimers, Limitation of Liability, Indemnification, and Governing Law shall survive any termination of these Terms.
            </p>
          </section>

          {/* Section 12 */}
          <section className="p-8 rounded-xl bg-[#131518] border border-[#1E222A]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              12. Changes to these Terms
            </h2>
            <p className="text-xs">
              We may revise these Terms from time to time to reflect technical updates, legal requirements, or new features. When updates occur, we will revise the &ldquo;Last Updated&rdquo; date at the top of this document. Continued use of ShotOnce after the effective date of revised Terms constitutes your acceptance of the changes.
            </p>
          </section>

          {/* Section 13 */}
          <section className="p-8 rounded-xl bg-[#131518] border border-[#1E222A]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              13. Governing Law &amp; Severability
            </h2>
            <p className="text-xs mb-3">
              These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without giving effect to any principles of conflicts of law. Any legal suit, action, or proceeding arising out of or related to these Terms shall be instituted exclusively in competent courts.
            </p>
            <p className="text-xs">
              If any provision of these Terms is found to be unlawful, void, or unenforceable, that provision shall be deemed severable and shall not affect the validity and enforceability of the remaining provisions.
            </p>
          </section>

          {/* Section 14: Contact */}
          <section className="p-8 rounded-xl bg-[#131518] border border-[#1E222A]">
            <h2 className="text-base font-bold text-[#F3F5F7] font-['Outfit'] mb-3">
              14. Contact &amp; Legal Notices
            </h2>
            <p className="mb-4 text-xs">
              If you have any questions, legal notices, copyright claims, or inquiries regarding these Terms of Use, please reach out to:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            
              <a
                href="mailto:iamalaboexcel@gmail.com"
                className="p-3 rounded-lg bg-[#1C2026] hover:bg-[#262B33] flex items-center gap-3 transition-colors border border-transparent hover:border-[#262B33]"
              >
                <Mail className="w-4 h-4 text-[#E5A93C]" />
                <span>iamalaboexcel@gmail.com</span>
              </a>

              <a
                href="https://alaboexcel.xyz"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-lg bg-[#1C2026] hover:bg-[#262B33] flex items-center gap-3 transition-colors border border-transparent hover:border-[#262B33]"
              >
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
