import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET all vehicles
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Vehicle');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single vehicle
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Vehicle WHERE Vehicle_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle record not found' });
    }
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST new vehicle
router.post('/', async (req, res) => {
  try {
    const { Vehicle_ID, Name, Type, Fuel_Status, Unit_Name } = req.body;
    
    if (!Vehicle_ID || !Name || !Type || !Fuel_Status || !Unit_Name) {
      return res.status(400).json({ error: 'All vehicle fields (*) are required' });
    }

    // Check duplicate
    const [existing] = await db.query('SELECT * FROM Vehicle WHERE Vehicle_ID = ?', [Vehicle_ID]);
    if (existing.length > 0) {
      return res.status(400).json({ error: `Record with Vehicle ID ${Vehicle_ID} already exists` });
    }

    await db.query(`
      INSERT INTO Vehicle (Vehicle_ID, Name, Type, Fuel_Status, Unit_Name)
      VALUES (?, ?, ?, ?, ?)
    `, [Vehicle_ID, Name, Type, Fuel_Status, Unit_Name]);

    res.status(201).json({ message: 'Vehicle record deployed successfully', Vehicle_ID });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update vehicle
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const fields = Object.keys(req.body).filter(key => key !== 'Vehicle_ID' && req.body[key] !== undefined);
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const params = fields.map(field => req.body[field]);
    params.push(id);

    const [result] = await db.query(`UPDATE Vehicle SET ${setClause} WHERE Vehicle_ID = ?`, params);
    res.json({ message: 'Vehicle record updated', affectedRows: result.affectedRows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE vehicle
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await db.query('DELETE FROM Vehicle WHERE Vehicle_ID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehicle record not found' });
    }
    res.json({ message: 'Vehicle record deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
