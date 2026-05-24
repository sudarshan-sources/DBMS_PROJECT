import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import soldierRouter from './backend/routes/soldiers.js';
import weaponRouter from './backend/routes/weapons.js';
import vehicleRouter from './backend/routes/vehicles.js';
import missionRouter from './backend/routes/missions.js';
import trainingRouter from './backend/routes/trainings.js';
import db from './backend/config/db.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());
  app.use(cors());

  // API - Stats Endpoint for Command Dashboard Briefing Screen
  app.get('/api/stats', async (req, res) => {
    try {
      const [soldiers] = await db.query('SELECT COUNT(*) FROM Soldier');
      const [weapons] = await db.query('SELECT COUNT(*) FROM Weapon');
      const [vehicles] = await db.query('SELECT COUNT(*) FROM Vehicle');
      const [missions] = await db.query('SELECT COUNT(*) FROM Mission');
      const [trainings] = await db.query('SELECT COUNT(*) FROM Training');

      // Fetch quantities of weapons for a more specialized army stat card metric!
      const [weaponItems] = await db.query('SELECT * FROM Weapon');
      const totalWeaponsQuantty = weaponItems.reduce((acc: number, item: any) => acc + (Number(item.Quantity) || 0), 0);

      res.json({
        soldiersCount: soldiers[0]['COUNT(*)'] || 0,
        weaponsCount: weapons[0]['COUNT(*)'] || 0,
        weaponsTotalQuantity: totalWeaponsQuantty,
        vehiclesCount: vehicles[0]['COUNT(*)'] || 0,
        missionsCount: missions[0]['COUNT(*)'] || 0,
        trainingsCount: trainings[0]['COUNT(*)'] || 0,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Command intelligence error: failed to compile dynamic statistics.', details: err.message });
    }
  });

  // Resources routers
  app.use('/api/soldiers', soldierRouter);
  app.use('/api/weapons', weaponRouter);
  app.use('/api/vehicles', vehicleRouter);
  app.use('/api/missions', missionRouter);
  app.use('/api/trainings', trainingRouter);

  // Vite Integration
  if (process.env.DISABLE_HMR === 'true' || process.env.NODE_ENV === 'production') {
    // In Production or Cloud Run, serve the static assets from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('🛡️ Indian Army Dashboard: Serving static assets in production mode.');
  } else {
    // In Dev Mode with Vite Dev Server Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('🛡️ Indian Army Dashboard: Vite middleware enabled for real-time development.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===========================================================`);
    console.log(`🇮🇳 BHARAT SHAKTI COMMAND OPS DEVELOPMENT SERVER ONLINE 🇮🇳`);
    console.log(`Port Ingress  : http://localhost:${PORT}`);
    console.log(`State Machine  : Sandbox Resilient JSON fallback active`);
    console.log(`===========================================================`);
  });
}

startServer();
