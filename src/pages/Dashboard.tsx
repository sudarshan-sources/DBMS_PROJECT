import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Info, FileText, CheckCircle2 } from 'lucide-react';
import api from '../api/axios.js';
import StatCard from '../components/StatCard.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import ErrorMessage from '../components/ErrorMessage.js';
import TacticalMap from '../components/TacticalMap.js';
import { DashboardStats } from '../types';

import armyDayHimalayas from '../assets/images/indian_army_himalayas_1779560969594.png';
import armyLogo from '../assets/images/indian_army_logo_1779560238364.png';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.get('/api/stats');
      setStats(resp.data);
    } catch (err: any) {
      setError(err.response?.data?.details || err.message || 'Error communicating with military command server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div id="dashboard-loading-view" className="h-[80vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div id="dashboard-error-view" className="p-8">
        <ErrorMessage message={error || 'No telemetry stats loaded.'} retry={fetchStats} />
      </div>
    );
  }

  return (
    <motion.div
      id="dashboard-root-panel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-8 pb-16"
    >
      {/* Hero Welcome Banner */}
      <div
        id="dashboard-hero"
        className="w-full relative px-6 py-10 md:py-14 rounded-xl overflow-hidden border border-[#3D4A22] shadow-2xl flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#2C3318] to-[#1A1F0E]"
      >
        {/* Camo Background decorative watermark watermark */}
        <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none text-9xl font-extrabold flex items-center justify-center">
          🇮🇳 INDIAN ARMY
        </div>

        <img
          src={armyLogo}
          alt="Indian Army Crest Emblem"
          className="h-20 w-20 md:h-24 md:w-24 object-contain rounded-full border-2 border-[#C9A84C] bg-[#232B14] p-1 mb-4 shadow-xl flex-shrink-0 animate-pulse-glow"
          referrerPolicy="no-referrer"
        />
        
        <h1 className="font-tactical text-3xl md:text-5xl font-black text-[#C9A84C] tracking-widest uppercase leading-none filter drop-shadow">
          DASHBOARD OPERATIONS CENTER
        </h1>
        
        <p className="font-sans text-xs md:text-sm text-[#E8DFB8] mt-2 tracking-wider font-semibold uppercase">
          Indian Army Dashboard Portal — National Defense Database
        </p>

        {/* Tricolor Horizontal Rule */}
        <div className="h-[4px] w-64 md:w-96 flex rounded-full overflow-hidden mt-5 mb-2 shadow">
          <div className="w-1/3 h-full bg-[#FF9933]" />
          <div className="w-1/3 h-full bg-[#E8DFB8]" />
          <div className="w-1/3 h-full bg-[#138808]" />
        </div>
        
        <p className="font-code text-[10px] text-[#8A9070] uppercase tracking-widest mt-1">
          BHARAT SHAKTI COMBAT ENGINE V3.0 • ENCRYPTED DASHBOARD BASE
        </p>
      </div>

      {/* Patriotic Indian Army Day Banner */}
      <div 
        id="army-celebration-banner" 
        className="w-full rounded-xl overflow-hidden border border-[#C9A84C]/35 hover:border-[#C9A84C]/75 transition-all duration-300 shadow-2xl relative bg-[#1A1F0E]"
      >
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[21/8] lg:aspect-[3/1] min-h-[250px] sm:min-h-[300px]">
          <img
            src={armyDayHimalayas}
            alt="Salute the Real Heroes - Indian Army Day Celebration"
            className="w-full h-full object-cover object-[center_35%] brightness-[0.65] contrast-[1.05]"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlay to blend into the bunker layout page background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F0E] via-[#1A1F0E]/10 to-black/35 pointer-events-none" />
          
          {/* Subtle Right Tricolor accent ribbon */}
          <div className="absolute top-0 right-0 h-[4px] w-48 flex rounded-bl-full overflow-hidden shadow">
            <div className="w-1/3 h-full bg-[#FF9933]" />
            <div className="w-1/3 h-full bg-[#E8DFB8]" />
            <div className="w-1/3 h-full bg-[#138808]" />
          </div>

          {/* Top-Left: "SALUTE THE REAL HEROES" */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 flex flex-col font-tactical select-none">
            <span className="text-xl sm:text-2xl md:text-3.5xl lg:text-4xl font-extrabold tracking-widest text-[#FF9933] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] uppercase leading-tight">
              SALUTE
            </span>
            <span className="text-xs sm:text-base md:text-lg lg:text-xl font-semibold tracking-widest text-[#E8DFB8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] my-1 uppercase leading-tight">
              THE REAL
            </span>
            <span className="text-xl sm:text-2xl md:text-3.5xl lg:text-4xl font-extrabold tracking-widest text-[#138808] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] uppercase leading-tight">
              HEROES
            </span>
          </div>

          {/* Center-Bottom: "INDIAN ARMY DAY" */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8 flex flex-col items-center justify-center font-tactical select-none text-center">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-widest uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.95)] flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-4 leading-none">
              <span className="text-[#FF9933]">INDIAN</span>
              <span className="text-[#E8DFB8]">ARMY</span>
              <span className="text-[#138808]">DAY</span>
            </h2>
            <p className="font-code text-[8px] sm:text-[10px] md:text-xs text-[#E8DFB8] tracking-widest mt-1.5 sm:mt-2.5 uppercase bg-[#1A1F0E]/90 px-3 py-1 rounded border border-[#3D4A22] font-semibold shadow">
              VALOR, COURAGE AND SACRIFICE • HONORING BHARAT KE VEER
            </p>
          </div>
        </div>
      </div>

      {/* 5 Stats Cards Grid in a row (responsive grid) */}
      <div id="stats-grid-row" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon="🪖"
          label="Soldier"
          count={stats.soldiersCount}
          subLabel="Deployed Soldiers"
        />
        <StatCard
          icon="⚔️"
          label="Weapon"
          count={stats.weaponsTotalQuantity}
          subLabel={`${stats.weaponsCount} Weapon Classes`}
        />
        <StatCard
          icon="🚗"
          label="Vehicle"
          count={stats.vehiclesCount}
          subLabel="Combat Vehicles"
        />
        <StatCard
          icon="🎯"
          label="Mission"
          count={stats.missionsCount}
          subLabel="Secured Missions"
        />
        <StatCard
          icon="🏋️"
          label="Training"
          count={stats.trainingsCount}
          subLabel="Training Classes"
        />
      </div>

      {/* Interactive Tactical Map Layer */}
      <TacticalMap />

      {/* Today's Briefing Panel */}
      <div id="todays-briefing-panel" className="rounded-xl border border-[#3D4A22] bg-[#2C3318]/50 p-6 md:p-8 shadow-xl">
        {/* Military Style Divider in Rajdhani uppercase with ——★—— */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <h3 className="font-tactical text-lg md:text-xl font-bold text-[#E8DFB8] uppercase tracking-widest leading-none">
            TODAY'S DASHBOARD BRIEFING
          </h3>
          <span className="font-code text-xs text-[#C9A84C] tracking-widest mt-1.5 select-none">
            ——★——
          </span>
        </div>

        {/* Briefing Contents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-2">
          {/* Card 1: Command Directives */}
          <div className="p-5 rounded bg-[#1A1F0E] border border-[#3D4A22]/50 flex flex-col gap-3">
            <h4 className="font-tactical text-xs font-bold uppercase tracking-widest text-[#FF9933] flex items-center gap-2 border-b border-[#3D4A22]/40 pb-2">
              <ShieldCheck className="h-4 w-4" />
              Directives
            </h4>
            <ul className="font-sans text-xs text-[#E8DFB8] space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#FF9933] mt-0.5">•</span>
                <span>Maintain strict Operational Security (OPSEC) on all soldier records.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF9933] mt-0.5">•</span>
                <span>Audit weapon quantities weekly to maximize regional safety metrics.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Strategic Focus */}
          <div className="p-5 rounded bg-[#1A1F0E] border border-[#3D4A22]/50 flex flex-col gap-3">
            <h4 className="font-tactical text-xs font-bold uppercase tracking-widest text-[#C9A84C] flex items-center gap-2 border-b border-[#3D4A22]/40 pb-2">
              <Info className="h-4 w-4" />
              Strategic Focus
            </h4>
            <div className="font-sans text-xs text-[#E8DFB8] space-y-2 leading-relaxed">
              <p>
                <strong>Current Training Level:</strong> High Alert (OPCON-1).
              </p>
              <p className="text-[#8A9070] mt-1">
                Combat divisions in Kashmir, Assam and Pune must sync training logs daily. Update vehicle fuel gauges dynamically before deployment workouts.
              </p>
            </div>
          </div>

          {/* Card 3: Live Telemetry */}
          <div className="p-5 rounded bg-[#1A1F0E] border border-[#3D4A22]/50 flex flex-col gap-3">
            <h4 className="font-tactical text-xs font-bold uppercase tracking-widest text-[#138808] flex items-center gap-2 border-b border-[#3D4A22]/40 pb-2">
              <FileText className="h-4 w-4" />
              System Log
            </h4>
            <ul className="font-code text-[11px] text-[#8A9070] space-y-2">
              <li className="flex items-center gap-2 text-[#E8DFB8]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#138808]" />
                <span>Dashboard portal synched</span>
              </li>
              <li className="flex items-center gap-2 text-[#E8DFB8]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#138808]" />
                <span>State database secured</span>
              </li>
              <li className="flex items-center gap-2">
                <span>● Host node: CLOUD-SANDBOX</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
