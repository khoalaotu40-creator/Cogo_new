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
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Số điện thoại không tồn tại' });
    }

    res.json({ message: 'Login successful', user: result.rows[0] });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  const { phone, name, intro_text } = req.body;

  if (!phone || !name) {
    return res.status(400).json({ error: 'Phone number and name are required' });
  }

  try {
    // Check if user exists
    const existing = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Số điện thoại đã được đăng ký' });
    }

    const insertResult = await pool.query(
      'INSERT INTO users (phone, name, intro_text) VALUES ($1, $2, $3) RETURNING *',
      [phone, name, intro_text]
    );

    res.json({ message: 'Register successful', user: insertResult.rows[0] });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
