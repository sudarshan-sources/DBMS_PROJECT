import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Shield, Users, Radio, Target, Navigation, MapPin, AlertTriangle, Activity, Loader2 } from 'lucide-react';
import api from '../api/axios.js';
import { Soldier, Mission } from '../types';

// Map sector definitions across India with coordinates and strategic descriptions
interface Sector {
  id: string;
  name: string;
  hindiName: string;
  center: [number, number];
  description: string;
  hq: string;
  defaultStatus: 'SECURE' | 'VIGILANT' | 'HIGH ALERT';
  color: string;
}

const DEFENSE_SECTORS: Sector[] = [
  {
    id: 'north',
    name: 'Northern Sector Command',
    hindiName: 'उत्तरी कमान',
    center: [34.0837, 74.7973],
    description: 'High altitude mountain ops, LoC vigilance, and Ladakh alpine defense.',
    hq: 'Udhampur / Srinagar',
    defaultStatus: 'HIGH ALERT',
    color: '#FF9933' // Alert/Vigilant color
  },
  {
    id: 'west',
    name: 'Western Sector Command',
    hindiName: 'पश्चिमी कमान',
    center: [26.2389, 73.0243],
    description: 'Desert survival tactics, armored vehicle exercises and border fencing oversight.',
    hq: 'Chandimandir / Jodhpur',
    defaultStatus: 'VIGILANT',
    color: '#C9A84C'
  },
  {
    id: 'sikkim',
    name: 'Eastern Himalayan Division',
    hindiName: 'सिक्किम प्रभाग',
    center: [27.3314, 88.6138],
    description: 'Nathu La alpine checkpoint, heavy artillery bases, and cold mountain training.',
    hq: 'Gangtok Base',
    defaultStatus: 'HIGH ALERT',
    color: '#FF9933'
  },
  {
    id: 'east',
    name: 'Eastern Sector Command',
    hindiName: 'पूर्वी कमान',
    center: [26.1158, 91.7086],
    description: 'Dense forest warfare operations and joint counter-intelligence divisions.',
    hq: 'Kolkata / Guwahati',
    defaultStatus: 'SECURE',
    color: '#138808'
  },
  {
    id: 'south',
    name: 'Southern Sector Command',
    hindiName: 'दक्षिणी कमान',
    center: [18.5204, 73.8567],
    description: 'Southern tactical command, warfare academy, and airborne division operations.',
    hq: 'Pune HQ',
    defaultStatus: 'SECURE',
    color: '#138808'
  },
  {
    id: 'central',
    name: 'Central Strike Division',
    hindiName: 'मध्य प्रभाग',
    center: [23.2599, 77.4126],
    description: 'Strike reserve divisions, centralized weapons armories, and advanced aviation wings.',
    hq: 'Lucknow / Bhopal',
    defaultStatus: 'SECURE',
    color: '#138808'
  },
  {
    id: 'maritime',
    name: 'Maritime Amphibious Command',
    hindiName: 'समुद्री कमान',
    center: [17.6868, 83.2185],
    description: 'Amphibious operations, deployment coordination, and coastal defense backup.',
    hq: 'Visakhapatnam Command',
    defaultStatus: 'VIGILANT',
    color: '#C9A84C'
  }
];

// Helper to update Leaflet view dynamically
function MapViewHandler({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function TacticalMap() {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<Sector>(DEFENSE_SECTORS[0]);
  const [mapZoom, setMapZoom] = useState(5);

  // Load backend intelligence data dynamically to build live bindings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [soldierResp, missionResp] = await Promise.all([
          api.get('/api/soldiers'),
          api.get('/api/missions')
        ]);
        setSoldiers(Array.isArray(soldierResp.data) ? soldierResp.data : []);
        setMissions(Array.isArray(missionResp.data) ? missionResp.data : []);
      } catch (err) {
        console.error('Failed to update live tactical telemetry maps:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Map soldier locations fuzzily to core sectors
  const getSectorSoldiers = (sectorId: string) => {
    return soldiers.filter(s => {
      const location = s.Posting_Location.toLowerCase();
      if (sectorId === 'north') {
        return location.includes('srinagar') || location.includes('kashmir') || location.includes('jammu') || location.includes('leh') || location.includes('ladakh');
      }
      if (sectorId === 'west') {
        return location.includes('jodhpur') || location.includes('rajasthan') || location.includes('chandimandir');
      }
      if (sectorId === 'sikkim') {
        return location.includes('sikkim') || location.includes('gangtok') || location.includes('nathu');
      }
      if (sectorId === 'east') {
        return location.includes('assam') || location.includes('guwahati') || location.includes('kolkata') || location.includes('forest');
      }
      if (sectorId === 'south') {
        return location.includes('pune') || location.includes('mumbai') || location.includes('bengaluru') || location.includes('chennai');
      }
      if (sectorId === 'central') {
        return location.includes('bhopal') || location.includes('delhi') || location.includes('lucknow');
      }
      if (sectorId === 'maritime') {
        return location.includes('visakhapatnam') || location.includes('vizag') || location.includes('coastal') || location.includes('sea');
      }
      return false;
    });
  };

  // Map active missions to core sectors
  const getSectorMissions = (sectorId: string) => {
    return missions.filter(m => {
      const location = m.Location.toLowerCase();
      if (sectorId === 'north') {
        return location.includes('srinagar') || location.includes('kashmir') || location.includes('jammu') || location.includes('leh') || location.includes('ladakh');
      }
      if (sectorId === 'west') {
        return location.includes('jodhpur') || location.includes('rajasthan') || location.includes('desert');
      }
      if (sectorId === 'sikkim') {
        return location.includes('sikkim') || location.includes('gangtok') || location.includes('himalaya');
      }
      if (sectorId === 'east') {
        return location.includes('assam') || location.includes('guwahati') || location.includes('border');
      }
      if (sectorId === 'south') {
        return location.includes('pune') || location.includes('mumbai') || location.includes('base');
      }
      if (sectorId === 'central') {
        return location.includes('bhopal') || location.includes('delhi') || location.includes('central');
      }
      if (sectorId === 'maritime') {
        return location.includes('visakhapatnam') || location.includes('coastal') || location.includes('bay');
      }
      return false;
    });
  };

  const handleSectorSelect = (sector: Sector) => {
    setSelectedSector(sector);
    setMapZoom(7);
  };

  // Create pulsing high-definition military status marker icon
  const getTacticalIcon = (sector: Sector, count: number) => {
    const pulseColor = sector.color;
    return L.divIcon({
      className: 'custom-military-sector-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <!-- Pulse echo rings -->
          <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full opacity-40" style="background-color: ${pulseColor}"></span>
          <span class="animate-pulse absolute inline-flex h-6 w-6 rounded-full opacity-60" style="background-color: ${pulseColor}"></span>
          <!-- Solid radar core -->
          <span class="relative flex items-center justify-center rounded-full h-4 w-4 border-2 border-[#E8DFB8] shadow-lg" style="background-color: ${pulseColor}">
            <span class="w-1.5 h-1.5 rounded-full bg-[#1A1F0E]" style="animation: pulse 1s infinite"></span>
          </span>
          <!-- Hover-reveal quick sector badge -->
          <div class="absolute -top-7 px-2 py-0.5 pointer-events-none rounded border border-[#3D4A22] bg-[#1A1F0E]/95 text-[#E8DFB8] font-code text-[8px] font-black tracking-wider whitespace-nowrap shadow-xl">
            ${count} OP_PERS
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-[400px] rounded-xl border border-[#3D4A22] bg-[#2C3318]/40 flex flex-col items-center justify-center gap-4 text-[#C9A84C] font-code">
        <Loader2 className="h-10 w-10 animate-spin" />
        <span className="text-xs uppercase tracking-widest text-[#E8DFB8]">INITIALIZING ENCRYPTED TACTICAL SATELLITE...</span>
      </div>
    );
  }

  return (
    <div 
      id="tactical-map-layer" 
      className="w-full flex flex-col lg:flex-row rounded-xl overflow-hidden border border-[#C9A84C]/30 shadow-2xl bg-[#1A1F0E]/95 hover:border-[#C9A84C]/60 transition-all duration-300 relative z-10"
    >
      {/* Decorative military crosshairs on panel corners */}
      <div className="absolute top-1 left-1 font-mono text-[8px] text-[#C9A84C]/40 pointer-events-none select-none">┌ GRID_LIVE ┐</div>
      <div className="absolute bottom-1 right-1 font-mono text-[8px] text-[#C9A84C]/40 pointer-events-none select-none block">└ SECURE_LINK ┘</div>

      {/* Map Control and Telemetry Panel */}
      <div className="w-full lg:w-96 bg-[#2C3318]/50 border-r border-[#3D4A22] p-5 flex flex-col gap-5 select-none relative z-20">
        <div className="border-b border-[#3D4A22]/65 pb-3">
          <div className="flex items-center gap-2 text-[#C9A84C]">
            <Radio className="h-5 w-5 animate-pulse" />
            <h3 className="font-tactical text-lg font-black tracking-widest uppercase">
              DEFENSE GRID INTEL
            </h3>
          </div>
          <p className="font-sans text-[11px] text-[#8A9070] uppercase tracking-wider mt-0.5">
            Sectors • Platoon Postings • Active Deployments
          </p>
        </div>

        {/* Dynamic Sector Selector Command List */}
        <div className="flex-1 flex flex-col gap-2.5 max-h-[340px] overflow-y-auto pr-1">
          {DEFENSE_SECTORS.map((sector) => {
            const sectorSoldiers = getSectorSoldiers(sector.id);
            const sectorMissions = getSectorMissions(sector.id);
            const isCurrent = selectedSector.id === sector.id;

            return (
              <button
                key={sector.id}
                onClick={() => handleSectorSelect(sector)}
                className={`w-full text-left p-3 rounded border transition-all duration-300 flex flex-col gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1A1F0E] border-[#C9A84C] text-[#E8DFB8] shadow-lg outline-none'
                    : 'bg-[#1A1F0E]/45 border-[#3D4A22]/60 hover:bg-[#1A1F0E]/80 text-[#8A9070] hover:text-[#E8DFB8] hover:border-[#C9A84C]/35'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-tactical text-xs font-bold uppercase tracking-widest">
                    {sector.name}
                  </span>
                  <span
                    className="font-code text-[8px] px-1.5 py-0.5 rounded border"
                    style={{
                      color: sector.color,
                      borderColor: `${sector.color}45`,
                      backgroundColor: `${sector.color}10`
                    }}
                  >
                    {sector.defaultStatus}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-code text-[#E8DFB8]/95 font-semibold">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-[#C9A84C]" />
                    {sectorSoldiers.length} ACTIVE
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Target className="h-3 w-3 text-[#FF9933]" />
                    {sectorMissions.length} MISSIONS
                  </span>
                </div>

                <p className="font-sans text-[10px] text-[#8A9070] leading-snug line-clamp-1 italic">
                  {sector.hq} HQ — {sector.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Current Selected Sector Detailed Telemetry readout */}
        <div className="p-3 bg-[#1A1F0E] border border-[#3D4A22] rounded flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-[#3D4A22]/50 pb-1.5">
            <span className="font-tactical text-xs text-[#C9A84C] font-black tracking-wider uppercase">
              {selectedSector.name} DETAILED FEED
            </span>
            <span className="font-code text-[10px] text-[#E8DFB8] tracking-widest select-none">
              {selectedSector.hindiName}
            </span>
          </div>

          <div className="space-y-1.5 font-code text-[11px] text-[#E8DFB8]">
            <div className="flex justify-between items-center">
              <span className="text-[#8A9070]">COMMAND COORD:</span>
              <span className="font-semibold text-right">
                {selectedSector.center[0].toFixed(4)}° N, {selectedSector.center[1].toFixed(4)}° E
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8A9070]">TACTICAL HQ:</span>
              <span className="font-semibold">{selectedSector.hq}</span>
            </div>
            
            {/* Displaying Live Personnel on selected Sector */}
            <div className="pt-1.5 border-t border-[#3D4A22]/40">
              <span className="text-[#8A9070] block mb-1">STATIONED PERSONNEL:</span>
              {getSectorSoldiers(selectedSector.id).length === 0 ? (
                <p className="text-[10px] italic text-[#8A9070] bg-[#2C3318]/25 p-1 rounded">No registered soldiers in this sector database. Defer recruitment data to Soldiers config.</p>
              ) : (
                <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                  {getSectorSoldiers(selectedSector.id).map(s => (
                    <span key={s.Soldier_ID} className="text-[9px] bg-[#2C3318]/80 text-[#E8DFB8] border border-[#3D4A22] px-1 rounded uppercase">
                      {s.Rank_Name.slice(0,4)}. {s.LName}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Displaying Live Missions in selected Sector */}
            <div className="pt-1.5 border-t border-[#3D4A22]/40">
              <span className="text-[#8A9070] block mb-1">TACTICAL DIRECT MISSIONS:</span>
              {getSectorMissions(selectedSector.id).length === 0 ? (
                <p className="text-[10px] italic text-[#8A9070] bg-[#2C3318]/25 p-1 rounded">No strategic missions currently running in this sector.</p>
              ) : (
                <div className="flex flex-col gap-1 max-h-14 overflow-y-auto">
                  {getSectorMissions(selectedSector.id).map(m => (
                    <span key={m.Mission_ID} className="text-[9px] bg-[#1a2f14] text-[#E8DFB8] px-1 py-0.5 rounded border border-[#138808]/40 uppercase flex justify-between select-none">
                      <span>🎯 {m.Name.slice(0, 15)}...</span>
                      <span className="text-[#C9A84C]">{m.Status}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Leaflet Map Layer */}
      <div id="leaflet-map-host" className="flex-1 h-[350px] lg:h-[500px] relative z-10 bg-[#1A1F0E]">
        <MapContainer
          center={selectedSector.center}
          zoom={mapZoom}
          className="h-full w-full outline-none"
          zoomControl={true}
        >
          {/* Apply ChangeView to dynamically pan map when clicked from the menu */}
          <MapViewHandler center={selectedSector.center} zoom={mapZoom} />

          {/* CartoDB Dark Matter tiles matching military color layouts perfectly */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Map markers for all sectors */}
          {DEFENSE_SECTORS.map((sector) => {
            const sectorSoldiers = getSectorSoldiers(sector.id);
            const sectorMissions = getSectorMissions(sector.id);

            return (
              <Marker
                key={sector.id}
                position={sector.center}
                icon={getTacticalIcon(sector, sectorSoldiers.length)}
                eventHandlers={{
                  click: () => {
                    setSelectedSector(sector);
                    setMapZoom(7);
                  }
                }}
              >
                <Popup className="tactical-military-popup">
                  <div className="bg-[#1A1F0E] text-[#E8DFB8] p-3 border border-[#C9A84C]/50 rounded shadow-2xl font-sans min-w-[220px]">
                    <div className="flex items-center justify-between border-b border-[#3D4A22] pb-1.5 mb-2">
                      <span className="font-tactical text-xs font-black tracking-wider uppercase text-[#C9A84C]">
                        {sector.name}
                      </span>
                      <span className="font-code text-[9px] bg-[#E8DFB8]/5 px-1 rounded uppercase">
                        {sector.defaultStatus}
                      </span>
                    </div>

                    <p className="font-sans text-[11px] text-[#8A9070] italic leading-tight mb-2">
                      {sector.description}
                    </p>

                    <div className="font-code text-[11px] space-y-1 pb-1 border-b border-[#3D4A22]/50 mb-2">
                      <div className="flex justify-between items-center text-[#E8DFB8]">
                        <span>TACTICAL HQ:</span>
                        <span className="font-bold">{sector.hq}</span>
                      </div>
                      <div className="flex justify-between items-center text-[#E8DFB8]">
                        <span>COORDINATE:</span>
                        <span>{sector.center[0]}° N, {sector.center[1]}° E</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-code">
                      <span className="flex items-center gap-1 text-[#E8DFB8]">
                        <Users className="h-3.5 w-3.5 text-[#C9A84C]" />
                        {sectorSoldiers.length} ACTIVE
                      </span>
                      <span className="flex items-center gap-1 text-[#E8DFB8]">
                        <Target className="h-3.5 w-3.5 text-[#FF9933]" />
                        {sectorMissions.length} MISSIONS
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Global HUD Layer Watermarks */}
        <div className="absolute top-3 right-3 bg-[#1A1F0E]/85 px-3 py-1.5 rounded border border-[#3D4A22] text-right font-code text-[9px] pointer-events-none select-none z-[1000] hidden sm:block">
          <div className="text-[#C9A84C] font-semibold flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#138808] animate-ping"></span>
            DEFENSE_GRID_OK_SECURE
          </div>
          <div className="text-[#8A9070] mt-0.5">LAT/LONG CORRECTION ACTIVE</div>
        </div>

        {/* Custom compass rose indicator */}
        <div className="absolute bottom-5 left-5 bg-[#1A1F0E]/85 p-2 rounded-full border border-[#3D4A22] text-[#C9A84C]/60 pointer-events-none z-[1000] shadow-md hidden sm:block">
          <Navigation className="h-6 w-6 transform rotate-45 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
