import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null;

  const rawStatus = status.trim();
  const lowerStatus = rawStatus.toLowerCase();

  // Green Active/Success Keywords
  const isGreen = [
    'active',
    'operational',
    'completed',
    'ongoing',
    'full'
  ].includes(lowerStatus);

  // Amber/Warning Keywords
  const isAmber = [
    'pending',
    'planned',
    'half',
    'low'
  ].includes(lowerStatus);

  // Red/Danger Keywords
  const isRed = [
    'inactive',
    'maintenance',
    'critical',
    'empty'
  ].includes(lowerStatus);

  let bgClass = 'bg-[#1A1F0E] text-[#8A9070] border-[#3D4A22]';
  let badgeText = rawStatus.toUpperCase();

  if (isGreen) {
    // Green
    bgClass = 'bg-[#138808]/15 text-[#138808] border-[#138808]/40 shadow-sm shadow-[#138808]/10 animate-pulse-glow';
  } else if (isAmber) {
    // Amber
    bgClass = 'bg-[#FF9933]/15 text-[#FF9933] border-[#FF9933]/40 shadow-sm shadow-[#FF9933]/10';
  } else if (isRed) {
    // Red
    bgClass = 'bg-[#D32F2F]/15 text-[#D32F2F] border-[#D32F2F]/40 shadow-sm shadow-[#D32F2F]/10 font-bold';
  }

  return (
    <span
      id={`badge-status-${lowerStatus.replace(/\s+/g, '-')}`}
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-code rounded border ${bgClass}`}
    >
      {isGreen && <span className="h-1.5 w-1.5 rounded-full bg-[#138808] animate-ping" />}
      {isAmber && <span className="h-1.5 w-1.5 rounded-full bg-[#FF9933]" />}
      {isRed && <span className="h-1.5 w-1.5 rounded-full bg-[#D32F2F] animate-pulse" />}
      {badgeText}
    </span>
  );
}
