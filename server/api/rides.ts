import { Router } from 'express';
import pool from '../db';

const router = Router();

// Create a new ride
router.post('/', async (req, res) => {
  const { userId, pickupLocation, dropoffLocation, typeRide } = req.body;

  if (!userId || !pickupLocation || !dropoffLocation || !typeRide) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate userId is a number (if it's an old UUID from local storage, it will fail)
  if (isNaN(Number(userId))) {
    return res.status(401).json({ error: 'Invalid user session. Please log out and log in again.' });
  }

  try {
    // 1. Update user's location
    await pool.query(
      'UPDATE users SET location = $1 WHERE id_user = $2',
      [JSON.stringify(pickupLocation), userId]
    );

    // 2. Insert new ride
    const result = await pool.query(
      'INSERT INTO rides (id_user, type_ride, "Diem_don", "Diem_den") VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, typeRide, JSON.stringify(pickupLocation), JSON.stringify(dropoffLocation)]
    );

    res.json({ message: 'Ride created successfully', ride: result.rows[0] });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available rides
router.get('/available', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name as driver_name, u.avatar_url, u.phone
       FROM rides r
       JOIN users u ON r.id_user = u.id_user
       WHERE r.type_ride = 'đi ngay' AND r.id_vehicle IS NULL
       ORDER BY r.id_ride DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get available rides error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get rides for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  if (isNaN(Number(userId))) {
    return res.status(401).json({ error: 'Invalid user session. Please log out and log in again.' });
  }

  try {
    const result = await pool.query(
      `SELECT r.*, u.location as pickup_location
       FROM rides r
       JOIN users u ON r.id_user = u.id_user
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
