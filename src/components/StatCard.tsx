import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface StatCardProps {
  icon: string | React.ReactNode;
  label: string;
  count: number;
  subLabel?: string;
  color?: string; // Additional color cues
}

export default function StatCard({ icon, label, count, subLabel, color = '#C9A84C' }: StatCardProps) {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = count;
    if (end <= 0) {
      setDisplayCount(0);
      return;
    }

    const duration = 1500; // 1.5 seconds completion
    const totalFrames = Math.max(10, Math.floor(duration / 16)); // max ~60fps
    const increment = Math.ceil(end / totalFrames);
    
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        clearInterval(timer);
        setDisplayCount(end);
      } else {
        setDisplayCount(current);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <motion.div
      id={`stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`}
      whileHover={{ y: -4, borderColor: '#C9A84C', boxShadow: '0 4px 20px rgba(201, 168, 76, 0.15)' }}
      className="relative flex flex-col justify-between p-5 rounded border border-[#3D4A22] bg-[#2C3318] hover:border-[#C9A84C] transition-all duration-300 group overflow-hidden"
    >
      {/* Brass-gold top border indicator */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C9A84C]" />

      <div className="flex items-center justify-between gap-4">
        <span className="font-tactical text-xs font-bold uppercase tracking-widest text-[#8A9070]">
          {label}
        </span>
        <div className="text-2xl filter drop-shadow group-hover:scale-110 transition-transform select-none">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-tactical text-4xl font-extrabold text-[#C9A84C] tracking-tight">
          {displayCount}
        </span>
        {subLabel && (
          <span className="font-code text-xs text-[#8A9070]">
            {subLabel}
          </span>
        )}
      </div>
      
      {/* Background Camo watermark highlight */}
      <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-[0.02] pointer-events-none select-none text-9xl group-hover:scale-125 transition-transform duration-500">
        🇮🇳
      </div>
    </motion.div>
  );
}
