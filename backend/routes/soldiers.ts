import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET all soldiers
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Soldier');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single soldier
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Soldier WHERE Soldier_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Soldier record not found' });
    }
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST new soldier
router.post('/', async (req, res) => {
  try {
    const { Soldier_ID, FName, LName, Rank_Name, Department, Age, Phone_Number, Posting_Location } = req.body;
    
    if (!Soldier_ID || !FName || !LName || !Rank_Name || !Department || !Posting_Location) {
      return res.status(400).json({ error: 'All primary fields (*) are required' });
    }

    // Check if duplicate ID exists
    const [existing] = await db.query('SELECT * FROM Soldier WHERE Soldier_ID = ?', [Soldier_ID]);
    if (existing.length > 0) {
      return res.status(400).json({ error: `Record with Soldier ID ${Soldier_ID} already exists` });
    }

    await db.query(`
      INSERT INTO Soldier (Soldier_ID, FName, LName, Rank_Name, Department, Age, Phone_Number, Posting_Location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [Soldier_ID, FName, LName, Rank_Name, Department, Number(Age) || 0, Phone_Number || '', Posting_Location]);

    res.status(201).json({ message: 'Personnel record deployed successfully', Soldier_ID });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update soldier
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const fields = Object.keys(req.body).filter(key => key !== 'Soldier_ID' && req.body[key] !== undefined);
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const params = fields.map(field => {
      if (field === 'Age') return Number(req.body[field]) || 0;
      return req.body[field];
    });
    params.push(id);

    const [result] = await db.query(`UPDATE Soldier SET ${setClause} WHERE Soldier_ID = ?`, params);
    res.json({ message: 'Personnel record updated successfully', affectedRows: result.affectedRows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE soldier
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    // Check if soldier is assigned to training classes to prevent constraint violations
    const [trainings] = await db.query('SELECT * FROM Training WHERE Soldier_ID = ?', [id]);
    if (trainings.length > 0) {
      return res.status(400).json({ error: 'Cannot delete soldier because they are currently assigned to Active Training. Please delete or modify the Training record first.' });
    }

    const [result] = await db.query('DELETE FROM Soldier WHERE Soldier_ID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Soldier record not found' });
    }
    res.json({ message: 'Personnel record removed successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
