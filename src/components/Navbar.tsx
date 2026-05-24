import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import armyLogo from '../assets/images/indian_army_logo_1779560238364.png';

export default function Navbar() {
  const location = useLocation();
  const [istTime, setIstTime] = useState('');

  // Determine current active page title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'COMMAND CENTRAL';
      case '/soldiers':
        return 'PERSONNEL DATABASE';
      case '/weapons':
        return 'ARMORY & ORDNANCE';
      case '/vehicles':
        return 'FLEET CONTROLS';
      case '/missions':
        return 'TACTICAL MISSIONS';
      case '/trainings':
        return 'READINESS & TRAINING';
      default:
        return 'ARMY COMMAND';
    }
  };

  // Live Indian Standard Time (IST) Clock
  useEffect(() => {
    const formatIST = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      };
      const now = new Date();
      try {
        const timePart = now.toLocaleTimeString('en-US', options);
        const datePart = now.toLocaleDateString('en-US', dateOptions);
        setIstTime(`${datePart.toUpperCase()} | ${timePart} IST`);
      } catch (e) {
        // Fallback if env/InLocal doesn't support options
        setIstTime(now.toLocaleTimeString());
      }
    };

    formatIST();
    const timer = setInterval(formatIST, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      id="main-navbar"
      className="h-[56px] bg-[#1A1F0E] flex flex-col justify-between sticky top-0 z-20 px-6 border-b-3 border-[#1A1F0E] shadow-md select-none"
    >
      <div className="flex-1 flex items-center justify-between">
        {/* Left Side: Page Title with Logo */}
        <div className="flex items-center gap-2.5">
          <img
            src={armyLogo}
            alt="Indian Army Logo"
            className="h-7 w-7 object-contain rounded-full border border-[#C9A84C]/30 bg-[#232B14] p-0.5 md:hidden flex-shrink-0 animate-pulse-glow"
            referrerPolicy="no-referrer"
          />
          <h2 className="font-tactical text-lg md:text-xl font-black text-[#E8DFB8] tracking-widest uppercase transition-all duration-300">
            {getPageTitle()}
          </h2>
        </div>

        {/* Right Side: IST Clock + Online Indicator */}
        <div className="flex items-center gap-4">
          {/* Live Date/Time IST */}
          <span className="hidden sm:inline-block font-code text-xs text-[#8A9070] bg-[#232B14] px-3 py-1 rounded border border-[#3D4A22]">
            {istTime}
          </span>

          {/* Status Badge */}
          <div className="flex items-center gap-1.5 bg-[#138808]/10 px-2.5 py-1 border border-[#138808]/30 rounded">
            <span className="h-2 w-2 rounded-full bg-[#138808] animate-ping" />
            <span className="font-code text-[10px] text-[#138808] font-black tracking-widest">
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Tricolor Bottom Border (33% saffron #FF9933, 33% white, 33% green #138808) */}
      <div className="h-[3px] w-full flex">
        <div className="w-1/3 h-full bg-[#FF9933]" />
        <div className="w-1/3 h-full bg-[#E8DFB8]" />
        <div className="w-1/3 h-full bg-[#138808]" />
      </div>
    </header>
  );
}
