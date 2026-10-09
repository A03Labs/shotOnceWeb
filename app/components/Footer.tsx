import React from 'react';
import { Link } from 'react-router';

export interface FooterProps {
  className?: string;
  variant?: 'page' | 'contained';
}

export function Footer({ className = '', variant = 'page' }: FooterProps) {
  const baseClasses =
    variant === 'contained'
      ? 'mt-12 pt-8 border-t border-[#1E222A] text-xs text-[#969EAA]'
      : 'py-12 px-6 sm:px-12 max-w-6xl mx-auto border-t border-[#181B22] text-xs text-[#969EAA]';

  return (
    <footer className={`${baseClasses} ${className}`.trim()}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[#F3F5F7] hover:opacity-90 transition-opacity"
          >
            <div className="w-5 h-5 rounded overflow-hidden bg-[#131518] shrink-0 border border-[#262B33]">
              <img
                src="/shotonce-icon.png"
                alt="ShotOnce"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold">ShotOnce</span>
          </Link>
          <span className="text-[#5C6370]">•</span>
          <span className="text-[#969EAA]">Alabo Excel</span>
          <span className="text-[#5C6370] font-mono text-[11px]">
            &copy; {new Date().getFullYear()}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-5 sm:gap-6 font-mono text-xs">
          <Link to="/" className="hover:text-[#F3F5F7] transition-colors">
            Home
          </Link>
          <Link to="/studio" className="hover:text-[#F3F5F7] transition-colors">
            Web Studio
          </Link>
          <Link to="/terms" className="hover:text-[#F3F5F7] transition-colors">
            Terms of Use
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
  );
}

export default Footer;
