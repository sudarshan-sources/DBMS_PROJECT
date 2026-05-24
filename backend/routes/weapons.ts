import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// GET all weapons
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Weapon');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single weapon
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Weapon WHERE Weapon_ID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Weapon record not found' });
    }
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST new weapon
router.post('/', async (req, res) => {
  try {
    const { Weapon_ID, Name, Type, Quantity, Status } = req.body;
    
    if (!Weapon_ID || !Name || !Type || Quantity === undefined || !Status) {
      return res.status(400).json({ error: 'All weapon fields (*) are required' });
    }

    // Check duplicate
    const [existing] = await db.query('SELECT * FROM Weapon WHERE Weapon_ID = ?', [Weapon_ID]);
    if (existing.length > 0) {
      return res.status(400).json({ error: `Record with Weapon ID ${Weapon_ID} already exists` });
    }

    await db.query(`
      INSERT INTO Weapon (Weapon_ID, Name, Type, Quantity, Status)
      VALUES (?, ?, ?, ?, ?)
    `, [Weapon_ID, Name, Type, Number(Quantity) || 0, Status]);

    res.status(201).json({ message: 'Weapon record deployed successfully', Weapon_ID });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update weapon
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const fields = Object.keys(req.body).filter(key => key !== 'Weapon_ID' && req.body[key] !== undefined);
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const params = fields.map(field => {
      if (field === 'Quantity') return Number(req.body[field]) || 0;
      return req.body[field];
    });
    params.push(id);

    const [result] = await db.query(`UPDATE Weapon SET ${setClause} WHERE Weapon_ID = ?`, params);
    res.json({ message: 'Weapon record updated', affectedRows: result.affectedRows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE weapon
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await db.query('DELETE FROM Weapon WHERE Weapon_ID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Weapon record not found' });
    }
    res.json({ message: 'Weapon record deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
