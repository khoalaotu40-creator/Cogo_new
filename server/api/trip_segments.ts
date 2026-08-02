import express from 'express';
import pool from '../db';

const router = express.Router();

// Get segments by trip ID
router.get('/trip/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const result = await pool.query('SELECT * FROM trip_segments WHERE id_trip = $1 ORDER BY segment_order ASC', [tripId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Get trip segments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create segment
router.post('/', async (req, res) => {
  try {
    const { id_trip, segment_order, distance_km, occupants_count, kigo_cost } = req.body;
    const result = await pool.query(
      `INSERT INTO trip_segments (id_trip, segment_order, distance_km, occupants_count, kigo_cost) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_trip, segment_order, distance_km, occupants_count, kigo_cost]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create trip segment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
