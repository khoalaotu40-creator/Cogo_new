import express from 'express';
import pool from '../db';

const router = express.Router();

// Get transactions by wallet ID
router.get('/wallet/:walletId', async (req, res) => {
  try {
    const { walletId } = req.params;
    const result = await pool.query(
      `SELECT * FROM transactions WHERE from_wallet_id = $1 OR to_wallet_id = $1 ORDER BY created_at DESC`, 
      [walletId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create transaction
router.post('/', async (req, res) => {
  try {
    const { id_trip, from_wallet_id, to_wallet_id, amount_kigo, tx_type, status } = req.body;
    
    // In a real app, you would use a database transaction here to ensure 
    // the wallets balances are updated atomically along with the transaction record
    await pool.query('BEGIN');
    
    // Create transaction record
    const txResult = await pool.query(
      `INSERT INTO transactions (id_trip, from_wallet_id, to_wallet_id, amount_kigo, tx_type, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id_trip, from_wallet_id, to_wallet_id, amount_kigo, tx_type, status]
    );
    
    // Update wallet balances if status is completed or success
    if (status === 'completed' || status === 'success') {
      if (from_wallet_id) {
        await pool.query('UPDATE wallets SET balance_kigo = balance_kigo - $1 WHERE id_wallet = $2', [amount_kigo, from_wallet_id]);
      }
      if (to_wallet_id) {
        await pool.query('UPDATE wallets SET balance_kigo = balance_kigo + $1 WHERE id_wallet = $2', [amount_kigo, to_wallet_id]);
      }
    }
    
    await pool.query('COMMIT');
    res.status(201).json(txResult.rows[0]);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
