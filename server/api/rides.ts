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
      'INSERT INTO rides (id_user, type_ride, "Diem_don", "Diem_den", status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, typeRide, JSON.stringify(pickupLocation), JSON.stringify(dropoffLocation), "Requested"]
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
       WHERE r.type_ride LIKE 'đi ngay%' AND r.id_vehicle IS NULL AND r.status = 'Requested'
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

// Accept ride API
router.post('/accept', async (req, res) => {
  try {
    const { id_ride, driver_id } = req.body;
    const vehicleId = 1; // Or find the vehicle associated with driver_id
    
    // Check if ride is still available
    const checkResult = await pool.query('SELECT * FROM rides WHERE id_ride = $1 AND id_vehicle IS NULL', [id_ride]);
    
    if (checkResult.rows.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Ride is no longer available' });
    }
    
    // Get the vehicle ID for this driver
    const vehicleResult = await pool.query('SELECT id_vehicle FROM vehicles WHERE id_user = $1 LIMIT 1', [driver_id]);
    let actualVehicleId = vehicleId;
    if (vehicleResult.rows.length > 0) {
      actualVehicleId = vehicleResult.rows[0].id_vehicle;
    }
    
    // Update ride with vehicle ID
    await pool.query('UPDATE rides SET id_vehicle = $1, status = $2 WHERE id_ride = $3', [actualVehicleId, 'Arriving', id_ride]);
    
    // Get user and vehicle locations
    const rideInfo = await pool.query(`
      SELECT 
        r.id_ride,
        r.status, 
        u.phone, 
        u.location as user_location,
        v.location as vehicle_location
      FROM rides r
      JOIN users u ON r.id_user = u.id_user
      JOIN vehicles v ON v.id_vehicle = r.id_vehicle
      WHERE r.id_ride = $1
    `, [id_ride]);
    
    const data = rideInfo.rows[0];
    if (data && typeof data.vehicle_location === 'string') {
      try {
        data.vehicle_location = JSON.parse(data.vehicle_location);
      } catch (e) {
        console.error("Failed to parse vehicle_location", e);
      }
    }
    
    res.json({ status: 'ok', data });
  } catch (err) {
    console.error('Accept ride error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to accept ride' });
  }
});


// Get specific ride status
router.get('/status/:rideId', async (req, res) => {
  try {
    const { rideId } = req.params;
    const result = await pool.query('SELECT status, id_vehicle FROM rides WHERE id_ride = $1', [rideId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get ride status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Complete ride API
router.post('/complete', async (req, res) => {
  try {
    const { id_ride } = req.body;
    
    // Update ride status to Completed
    await pool.query('UPDATE rides SET status = $1 WHERE id_ride = $2', ['Completed', id_ride]);
    
    res.json({ status: 'ok', message: 'Ride completed successfully' });
  } catch (err) {
    console.error('Complete ride error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to complete ride' });
  }
});


// Pickup user API
router.post('/pickup', async (req, res) => {
  try {
    const { id_ride } = req.body;
    
    // Update ride status to In Progress
    await pool.query('UPDATE rides SET status = $1 WHERE id_ride = $2', ['In Progress', id_ride]);
    
    res.json({ status: 'ok', message: 'Picked up successfully' });
  } catch (err) {
    console.error('Pickup ride error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to pickup' });
  }
});

export default router;
