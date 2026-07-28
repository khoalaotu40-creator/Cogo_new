import { Router } from 'express';
import pool from '../db';

const router = Router();

// Login endpoint
router.post('/login', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    // Check if user exists
    const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    
    let user;
    if (result.rows.length === 0) {
      // Create new user
      const insertResult = await pool.query(
        'INSERT INTO users (phone) VALUES ($1) RETURNING *',
        [phone]
      );
      user = insertResult.rows[0];
    } else {
      user = result.rows[0];
    }

    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear data endpoint for testing
router.delete('/clear', async (req, res) => {
  try {
    await pool.query('DELETE FROM users');
    res.json({ message: 'All user data cleared' });
  } catch (error) {
    console.error('Clear data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
