import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET all trainings (with JOIN)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, s.FName, s.LName,
             CONCAT(s.FName, ' ', s.LName) AS Soldier_Name
      FROM Training t
      JOIN Soldier s ON t.Soldier_ID = s.Soldier_ID
    `);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single training class
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Training WHERE Training_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Training record not found' });
    }
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST new training
router.post('/', async (req, res) => {
  try {
    const { Training_ID, Soldier_ID, Type, Training_Name, Training_Status } = req.body;
    
    if (!Training_ID || !Soldier_ID || !Type || !Training_Name || !Training_Status) {
      return res.status(400).json({ error: 'All training fields (*) are required' });
    }

    // Verify Soldier_ID exists
    const [soldier] = await db.query('SELECT * FROM Soldier WHERE Soldier_ID = ?', [Soldier_ID]);
    if (soldier.length === 0) {
      return res.status(400).json({ error: `Soldier with ID ${Soldier_ID} does not exist in the database` });
    }

    // Check duplicate Training ID
    const [existing] = await db.query('SELECT * FROM Training WHERE Training_ID = ?', [Training_ID]);
    if (existing.length > 0) {
      return res.status(400).json({ error: `Record with Training ID ${Training_ID} already exists` });
    }

    await db.query(`
      INSERT INTO Training (Training_ID, Soldier_ID, Type, Training_Name, Training_Status)
      VALUES (?, ?, ?, ?, ?)
    `, [Training_ID, Soldier_ID, Type, Training_Name, Training_Status]);

    res.status(201).json({ message: 'Training deployment created successfully', Training_ID });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update training
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const fields = Object.keys(req.body).filter(key => key !== 'Training_ID' && req.body[key] !== undefined);
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    // If updating Soldier_ID, check if soldier exists
    if (req.body.Soldier_ID) {
      const [soldier] = await db.query('SELECT * FROM Soldier WHERE Soldier_ID = ?', [req.body.Soldier_ID]);
      if (soldier.length === 0) {
        return res.status(400).json({ error: `Soldier with ID ${req.body.Soldier_ID} does not exist` });
      }
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const params = fields.map(field => req.body[field]);
    params.push(id);

    const [result] = await db.query(`UPDATE Training SET ${setClause} WHERE Training_ID = ?`, params);
    res.json({ message: 'Training record updated', affectedRows: result.affectedRows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE training
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await db.query('DELETE FROM Training WHERE Training_ID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Training record not found' });
    }
    res.json({ message: 'Training record erased' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
