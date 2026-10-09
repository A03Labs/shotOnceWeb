import React from 'react';

export interface IconProps {
  className?: string;
}

/**
 * Official Apple App Store Icon (Squircle badge with white symbol)
 */
export function AppStoreIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 448 512"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* White background so the cutout "A" shines through in white */}
      <rect x="0" y="32" width="448" height="448" rx="96" fill="#FFFFFF" />
      {/* Apple App Store blue mask and cutout symbol */}
      <path
        fill="#0071E3"
        d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM127 384.5c-5.5 9.6-17.8 12.8-27.3 7.3-9.6-5.5-12.8-17.8-7.3-27.3l14.3-24.7c16.1-4.9 29.3-1.1 39.6 11.4L127 384.5zm138.9-53.9H84c-11 0-20-9-20-20s9-20 20-20h51l65.4-113.2-20.5-35.4c-5.5-9.6-2.2-21.8 7.3-27.3 9.6-5.5 21.8-2.2 27.3 7.3l8.9 15.4 8.9-15.4c5.5-9.6 17.8-12.8 27.3-7.3 9.6 5.5 12.8 17.8 7.3 27.3l-85.8 148.6h62.1c20.2 0 31.5 23.7 22.7 40zm98.1 0h-29l19.6 33.9c5.5 9.6 2.2 21.8-7.3 27.3-9.6 5.5-21.8 2.2-27.3-7.3-32.9-56.9-57.5-99.7-74-128.1-16.7-29-4.8-58 7.1-67.8 13.1 22.7 32.7 56.7 58.9 102h52c11 0 20 9 20 20 0 11.1-9 20-20 20z"
      />
    </svg>
  );
}

/**
 * Official Google Play Icon (4-color authentic vector triangle)
 */
export function GooglePlayIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top segment: Google Green */}
      <path
        fill="#00E676"
        d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"
      />
      {/* Left segment: Google Blue */}
      <path
        fill="#0086F9"
        d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"
      />
      {/* Right apex tip: Google Yellow */}
      <path
        fill="#FFC400"
        d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z"
      />
      {/* Bottom segment: Google Red */}
      <path
        fill="#FF3333"
        d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z"
      />
    </svg>
  );
}
