import express from 'express';
import pool from '../db';

const router = express.Router();

// Get wallet by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query('SELECT * FROM wallets WHERE id_user = $1', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create wallet
router.post('/', async (req, res) => {
  try {
    const { id_user, wallet_type, balance_kigo } = req.body;
    const result = await pool.query(
      `INSERT INTO wallets (id_user, wallet_type, balance_kigo) VALUES ($1, $2, $3) RETURNING *`,
      [id_user, wallet_type, balance_kigo || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create wallet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
