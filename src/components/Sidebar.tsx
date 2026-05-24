import React from 'react';
import { NavLink } from 'react-router-dom';
import armyLogo from '../assets/images/indian_army_logo_1779560238364.png';

const navItems = [
  { path: '/', label: 'DASHBOARD', icon: '🏛️' },
  { path: '/soldiers', label: 'SOLDIER', icon: '🪖' },
  { path: '/weapons', label: 'WEAPON', icon: '⚔️' },
  { path: '/vehicles', label: 'VEHICLE', icon: '🚗' },
  { path: '/missions', label: 'MISSION', icon: '🎯' },
  { path: '/trainings', label: 'TRAINING', icon: '🏋️' }
];

export default function Sidebar() {
  // CSS repeating camo linear-gradient
  const camoBackgroundStyle = {
    backgroundImage: `
      repeating-linear-gradient(45deg, #232B14, #232B14 12px, #2A3318 12px, #2A3318 24px, #1E2411 24px, #1E2411 36px)
    `
  };

  return (
    <>
      {/* Desktop Sidebar (Medium & above) */}
      <aside
        id="desktop-sidebar"
        style={camoBackgroundStyle}
        className="hidden md:flex flex-col w-64 h-screen sticky top-0 justify-between border-r border-[#3D4A22] shadow-2xl z-30 flex-shrink-0"
      >
        {/* Top Logo Unit */}
        <div className="p-5 border-b border-[#3D4A22] flex items-center gap-3 bg-[#1A1F0E]/40 backdrop-blur-sm">
          <img
            src={armyLogo}
            alt="Indian Army Crest"
            className="h-10 w-10 object-contain rounded-full border border-[#C9A84C]/40 bg-[#232B14] p-0.5 shadow-lg flex-shrink-0 animate-pulse-glow"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="font-tactical text-lg font-black text-[#E8DFB8] tracking-widest leading-none">
              INDIAN ARMY
            </h1>
            <span className="font-code text-[8px] text-[#C9A84C] tracking-wider uppercase font-bold mt-1 block">
              COMMAND SYSTEM
            </span>
          </div>
        </div>

        {/* Navigation Options */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              id={`nav-link-${item.label.toLowerCase()}`}
              to={item.path}
              className={({ isActive }) => `
                relative flex items-center gap-4 px-4 py-3.5 rounded font-tactical font-bold text-sm tracking-wider uppercase transition-all overflow-hidden cursor-pointer group
                ${isActive
                  ? 'bg-[#2C3318] text-[#C9A84C] border-l-[3px] border-[#C9A84C] shadow-md shadow-[#1A1F0E]'
                  : 'text-[#E8DFB8] hover:text-[#C9A84C]'
                }
              `}
            >
              {/* Left animated border slide-in for non-active hover */}
              {({ isActive }) => (
                <>
                  {!isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-0 bg-[#FF9933] transition-all duration-300 group-hover:w-[3px]" />
                  )}
                  <span className="text-xl group-hover:scale-115 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Motto Unit */}
        <div className="p-5 border-t border-[#3D4A22] bg-[#1A1F0E]/50 text-center">
          <div className="font-tactical font-black text-[#C9A84C] text-[11px] tracking-widest uppercase">
            BHARAT SHAKTI
          </div>
          <div className="font-sans text-[10px] text-[#8A9070] italic mt-0.5">
            "सेवा परमो धर्मः"
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Navigation (Small devices) */}
      <nav
        id="mobile-navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#232B14] border-t border-[#3D4A22] flex justify-around items-center z-40 px-2 shadow-2xl"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            id={`nav-link-mobile-${item.label.toLowerCase()}`}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors
              ${isActive
                ? 'text-[#C9A84C] border-t-2 border-[#C9A84C] bg-[#2C3318]/50'
                : 'text-[#E8DFB8]/70'
              }
            `}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="font-tactical font-bold text-[9px] tracking-wider mt-1 uppercase">
              {item.label === 'DASHBOARD' ? 'HOME' : item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
