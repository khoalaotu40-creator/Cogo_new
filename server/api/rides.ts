import { Router } from 'express';
import pool from '../db';

const router = Router();

// Create a new ride
router.post('/', async (req, res) => {
  const { userId, pickupLocation, dropoffLocation } = req.body;

  if (!userId || !pickupLocation || !dropoffLocation) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Update user's location
    await pool.query(
      'UPDATE users SET location = $1 WHERE id = $2',
      [JSON.stringify(pickupLocation), userId]
    );

    // 2. Insert new ride
    // Wait, does rides table have dropoffLocation? 
    // The user asked: id_ride, id_user, id_vehicle
    // We should probably just insert id_user for now, and maybe id_vehicle as null
    const result = await pool.query(
      'INSERT INTO rides (id_user) VALUES ($1) RETURNING *',
      [userId]
    );

    res.json({ message: 'Ride created successfully', ride: result.rows[0] });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get rides for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT r.*, u.location as pickup_location
       FROM rides r
       JOIN users u ON r.id_user = u.id
       WHERE r.id_user = $1 
       ORDER BY r.id_ride DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
