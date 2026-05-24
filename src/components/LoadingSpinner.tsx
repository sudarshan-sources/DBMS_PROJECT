import React from 'react';
import armyLogo from '../assets/images/indian_army_logo_1779560238364.png';

export default function LoadingSpinner() {
  return (
    <div id="loading-spinner" className="flex flex-col items-center justify-center p-8 bg-[#232B14]/40 border border-[#3D4A22] rounded-xl shadow-lg max-w-sm mx-auto my-6 backdrop-blur">
      {/* Heavy Clashing Swords SVG Canvas */}
      <div className="relative h-24 w-48 flex items-center justify-center select-none overflow-visible">
        {/* Exact Indian Army Logo Centered Behind/Within Clashing Swords */}
        <img
          src={armyLogo}
          alt="Indian Army Crest Centered"
          className="absolute w-12 h-12 object-contain rounded-full border border-[#C9A84C]/55 bg-[#232B14]/90 p-0.5 shadow-xl z-10 pointer-events-none animate-pulse-glow top-[32px]"
          referrerPolicy="no-referrer"
        />

        <svg
          viewBox="0 0 200 120"
          className="h-full w-full overflow-visible relative z-20"
          fill="none"
        >
          {/* Defs for gradients & filters */}
          <defs>
            <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="25%" stopColor="#FF9933" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#C9A84C" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1A1F0E" stopOpacity="0" />
            </radialGradient>
            
            <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>

          {/* Background Tactical Crosshair / Radar ring */}
          <circle cx="100" cy="55" r="45" stroke="#3D4A22" strokeWidth="1" strokeDasharray="3, 3" className="opacity-60" />
          <circle cx="100" cy="55" r="25" stroke="#3D4A22" strokeWidth="0.75" className="opacity-40" />
          <line x1="100" y1="5" x2="100" y2="105" stroke="#3D4A22" strokeWidth="0.5" className="opacity-30" />
          <line x1="50" y1="55" x2="150" y2="55" stroke="#3D4A22" strokeWidth="0.5" className="opacity-30" />

          {/* Left Sword - Pivot origin is (75, 95) */}
          <g 
            className="animate-sword-left" 
            style={{ transformOrigin: '75px 95px' }}
          >
            {/* Sword Blade */}
            <path d="M 73.5 95 L 73.5 15 L 75 7 L 76.5 15 L 76.5 95 Z" fill="url(#bladeGrad)" stroke="#475569" strokeWidth="0.5" />
            <line x1="75" y1="18" x2="75" y2="92" stroke="#C9A84C" strokeWidth="0.75" />
            
            {/* Elegant Crossguard */}
            <rect x="64" y="92" width="22" height="4.5" rx="1" fill="#C9A84C" stroke="#232B14" strokeWidth="0.5" />
            {/* Guard details */}
            <circle cx="65.5" cy="94.25" r="1.25" fill="#E8DFB8" />
            <circle cx="84.5" cy="94.25" r="1.25" fill="#E8DFB8" />

            {/* Saffron Grip (representing Indian colors) */}
            <rect x="73" y="96.5" width="4" height="15" rx="0.5" fill="#FF9933" />
            {/* Leather Grip Wraps */}
            <line x1="73" y1="100" x2="77" y2="100" stroke="#1A1F0E" strokeWidth="0.5" />
            <line x1="73" y1="104" x2="77" y2="104" stroke="#1A1F0E" strokeWidth="0.5" />
            <line x1="73" y1="108" x2="77" y2="108" stroke="#1A1F0E" strokeWidth="0.5" />

            {/* Gold Pommel */}
            <circle cx="75" cy="113.5" r="3.5" fill="#C9A84C" stroke="#232B14" strokeWidth="0.5" />
          </g>

          {/* Right Sword - Pivot origin is (125, 95) */}
          <g 
            className="animate-sword-right" 
            style={{ transformOrigin: '125px 95px' }}
          >
            {/* Sword Blade */}
            <path d="M 123.5 95 L 123.5 15 L 125 7 L 126.5 15 L 126.5 95 Z" fill="url(#bladeGrad)" stroke="#475569" strokeWidth="0.5" />
            <line x1="125" y1="18" x2="125" y2="92" stroke="#C9A84C" strokeWidth="0.75" />

            {/* Elegant Crossguard */}
            <rect x="114" y="92" width="22" height="4.5" rx="1" fill="#C9A84C" stroke="#232B14" strokeWidth="0.5" />
            {/* Guard details */}
            <circle cx="115.5" cy="94.25" r="1.25" fill="#E8DFB8" />
            <circle cx="134.5" cy="94.25" r="1.25" fill="#E8DFB8" />

            {/* Indian Army Emerald Green Grip */}
            <rect x="123" y="96.5" width="4" height="15" rx="0.5" fill="#138808" />
            {/* Leather Grip Wraps */}
            <line x1="123" y1="100" x2="127" y2="100" stroke="#1A1F0E" strokeWidth="0.5" />
            <line x1="123" y1="104" x2="127" y2="104" stroke="#1A1F0E" strokeWidth="0.5" />
            <line x1="123" y1="108" x2="127" y2="108" stroke="#1A1F0E" strokeWidth="0.5" />

            {/* Gold Pommel */}
            <circle cx="125" cy="113.5" r="3.5" fill="#C9A84C" stroke="#232B14" strokeWidth="0.5" />
          </g>

          {/* Clash dynamic golden burst spark - Centered perfectly around cross clash zone (100, 48) */}
          <g transform="translate(100, 48)">
            <ellipse cx="0" cy="0" rx="22" ry="22" fill="url(#sparkGlow)" className="animate-sword-spark select-none pointer-events-none" />
          </g>
        </svg>
      </div>

      <p className="mt-5 font-tactical font-black text-xs uppercase tracking-widest text-[#C9A84C] animate-pulse select-none flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-[#FF9933] animate-ping" />
        SYNCING SECURE COMMUNICATIONS
      </p>
    </div>
  );
}
