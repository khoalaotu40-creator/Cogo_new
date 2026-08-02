import express from 'express';
import pool from '../db';

const router = express.Router();

// Get all trips
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trips ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific trip by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM trips WHERE id_trip = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new trip
router.post('/', async (req, res) => {
  try {
    const { id_vehicle, id_ride, post_id, matrix_c_value, total_distance_km, total_kigo, status, user_id } = req.body;
    const result = await pool.query(
      `INSERT INTO trips (id_vehicle, id_ride, post_id, matrix_c_value, total_distance_km, total_kigo, status, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [id_vehicle, id_ride, post_id, matrix_c_value, total_distance_km, total_kigo, status, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
