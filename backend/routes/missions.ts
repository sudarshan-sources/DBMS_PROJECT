import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET all missions
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Mission');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET query by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Mission WHERE Mission_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Mission record not found' });
    }
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST new mission
router.post('/', async (req, res) => {
  try {
    const { Mission_ID, Name, Location, Mission_Date, Status } = req.body;
    
    if (!Mission_ID || !Name || !Location || !Mission_Date || !Status) {
      return res.status(400).json({ error: 'All mission fields (*) are required' });
    }

    // Check duplicate
    const [existing] = await db.query('SELECT * FROM Mission WHERE Mission_ID = ?', [Mission_ID]);
    if (existing.length > 0) {
      return res.status(400).json({ error: `Record with Mission ID ${Mission_ID} already exists` });
    }

    await db.query(`
      INSERT INTO Mission (Mission_ID, Name, Location, Mission_Date, Status)
      VALUES (?, ?, ?, ?, ?)
    `, [Mission_ID, Name, Location, Mission_Date, Status]);

    res.status(201).json({ message: 'Ops mission deployed successfully', Mission_ID });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update mission
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const fields = Object.keys(req.body).filter(key => key !== 'Mission_ID' && req.body[key] !== undefined);
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const params = fields.map(field => req.body[field]);
    params.push(id);

    const [result] = await db.query(`UPDATE Mission SET ${setClause} WHERE Mission_ID = ?`, params);
    res.json({ message: 'Mission record refreshed', affectedRows: result.affectedRows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE mission
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await db.query('DELETE FROM Mission WHERE Mission_ID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Mission record not found' });
    }
    res.json({ message: 'Mission record scrubbed' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
