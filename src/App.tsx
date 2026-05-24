import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast.jsx';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';

// Import Pages
import Dashboard from './pages/Dashboard.jsx';
import Soldiers from './pages/Soldiers.jsx';
import Weapons from './pages/Weapons.jsx';
import Vehicles from './pages/Vehicles.jsx';
import Missions from './pages/Missions.jsx';
import Trainings from './pages/Trainings.jsx';

// Import Himalayas Background PNG
import armyDayHimalayas from './assets/images/indian_army_himalayas_1779560969594.png';

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <div id="command-ops-container" className="flex flex-col md:flex-row min-h-screen w-full bg-[#1A1F0E] text-[#E8DFB8] select-none relative overflow-hidden">
          {/* Global Dynamic Alpine Background - -45% brightness & custom safe opacity */}
          <div className="absolute inset-0 pointer-events-none select-none z-0">
            <img
              src={armyDayHimalayas}
              alt="Himalayan Operations Background"
              className="w-full h-full object-cover object-center pointer-events-none select-none opacity-[0.25]"
              style={{ filter: 'brightness(0.55)' }}
              referrerPolicy="no-referrer"
            />
            {/* Blend matrix to guard high contrast and legibility */}
            <div className="absolute inset-0 bg-[#1A1F0E]/80 mix-blend-multiply" />
          </div>

          {/* Main Camo Navigation Bar/Sidebar */}
          <Sidebar />

          {/* Right Action Canvas Section */}
          <div id="content-canvas" className="flex-1 min-w-0 flex flex-col bg-[#1A1F0E]/50 md:bg-transparent overflow-y-auto max-h-screen relative z-10 backdrop-blur-[1px] md:backdrop-blur-none">
            {/* Top Tactical Bar */}
            <Navbar />

            {/* Tactical Resource Subsections */}
            <main id="command-center-canvas" className="flex-1 overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/soldiers" element={<Soldiers />} />
                <Route path="/weapons" element={<Weapons />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/missions" element={<Missions />} />
                <Route path="/trainings" element={<Trainings />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ToastProvider>
  );
}
