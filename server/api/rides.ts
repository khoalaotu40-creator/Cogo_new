import { Router } from 'express';
import pool from '../db';


function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
      `SELECT 
         r.*, 
         passenger.name as passenger_name, 
         passenger.avatar_url as passenger_avatar_url, 
         passenger.phone as passenger_phone,
         driver.name as driver_name,
         driver.avatar_url as driver_avatar,
         driver.phone as driver_phone
       FROM rides r
       JOIN users passenger ON r.id_user = passenger.id_user
       LEFT JOIN vehicles v ON r.id_vehicle = v.id_vehicle
       LEFT JOIN users driver ON v.id_user = driver.id_user
       WHERE r.type_ride LIKE 'đi ngay%' AND r.status IN ('Requested', 'Arriving', 'In Progress')
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
    
    // Get ride details for creating trip
    const rideDetails = await pool.query('SELECT * FROM rides WHERE id_ride = $1', [id_ride]);
    const rideData = rideDetails.rows[0];
    
    if (rideData) {
      // Calculate real distance using coordinates
      let distance = 0;
      try {
        const rawDon = rideData.Diem_don || rideData.diem_don;
        const rawDen = rideData.Diem_den || rideData.diem_den;
        
        let diemDon = typeof rawDon === 'string' ? JSON.parse(rawDon) : rawDon;
        if (typeof diemDon === 'string') diemDon = JSON.parse(diemDon);
        
        let diemDen = typeof rawDen === 'string' ? JSON.parse(rawDen) : rawDen;
        if (typeof diemDen === 'string') diemDen = JSON.parse(diemDen);
        
        if (diemDon && diemDon.routeDistance) {
            distance = Number(diemDon.routeDistance) / 1000;
            console.log("[RIDE ACCEPT] Using routeDistance from payload (km):", distance);
        } else if (diemDon && diemDon.lat && diemDon.lng && diemDen && diemDen.lat && diemDen.lng) {
          distance = getDistanceFromLatLonInKm(Number(diemDon.lat), Number(diemDon.lng), Number(diemDen.lat), Number(diemDen.lng));
          console.log("[RIDE ACCEPT] Calculated straight-line distance fallback (km):", distance);
        } else {
          console.error("[RIDE ACCEPT] Missing lat/lng.", "diemDon:", diemDon, "diemDen:", diemDen);
        }
      } catch (e) {
        console.error("[RIDE ACCEPT] Failed to parse Diem_don / Diem_den", e);
      }
      
      // Calculate a basic cost: 10 kigo per km, minimum 10
      const totalKigo = Math.max(10, Math.round(distance * 10));

      
      // Create a trip record
      const tripResult = await pool.query(
        `INSERT INTO trips (id_vehicle, id_ride, matrix_c_value, total_distance_km, total_kigo, status, user_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_trip`,
        [actualVehicleId, id_ride, 1.0, distance, totalKigo, 'active', rideData.id_user]
      );
      
      if (tripResult.rows.length > 0) {
        const tripId = tripResult.rows[0].id_trip;
        
        // Create an initial trip segment
        await pool.query(
          `INSERT INTO trip_segments (id_trip, segment_order, distance_km, occupants_count, kigo_cost)
           VALUES ($1, $2, $3, $4, $5)`,
          [tripId, 1, distance, 1, totalKigo]
        );
      }
    }
    
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
    if (!rideId || rideId === 'undefined' || isNaN(Number(rideId))) {
       console.error(`[API] /status/:rideId - Invalid rideId: ${rideId}`);
       return res.status(400).json({ error: 'Invalid ride ID' });
    }
    const result = await pool.query('SELECT status, id_vehicle FROM rides WHERE id_ride = $1', [rideId]);
    if (result.rows.length === 0) {
      console.warn(`[API] /status/:rideId - Ride not found: ${rideId}`);
      return res.status(404).json({ error: 'Ride not found' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error(`[API] /status/:rideId - Get ride status error for ID ${req.params.rideId}:`, error.message || error);
    res.status(500).json({ error: 'Internal server error', details: error.message || String(error) });
  }
});


// Complete ride API
router.post('/complete', async (req, res) => {
  try {
    const { id_ride } = req.body;
    
    // Update ride status to Completed
    await pool.query('UPDATE rides SET status = $1 WHERE id_ride = $2', ['Completed', id_ride]);
    
    // Update trip status and generate transaction
    const tripRes = await pool.query('SELECT * FROM trips WHERE id_ride = $1', [id_ride]);
    const trip = tripRes.rows[0];
    
    if (trip) {
      await pool.query('UPDATE trips SET status = $1 WHERE id_trip = $2', ['completed', trip.id_trip]);
      
      // Get driver user_id from vehicle
      const vehicleRes = await pool.query('SELECT id_user FROM vehicles WHERE id_vehicle = $1', [trip.id_vehicle]);
      const driverUserId = vehicleRes.rows[0]?.id_user;
      
      const passengerId = trip.user_id;
      
      if (passengerId && driverUserId) {
        // Find wallets
        const pWalletRes = await pool.query('SELECT id_wallet FROM wallets WHERE id_user = $1 LIMIT 1', [passengerId]);
        const dWalletRes = await pool.query('SELECT id_wallet FROM wallets WHERE id_user = $1 LIMIT 1', [driverUserId]);
        
        let pWalletId = pWalletRes.rows[0]?.id_wallet;
        let dWalletId = dWalletRes.rows[0]?.id_wallet;
        
        // Auto create wallets if missing for demo
        if (!pWalletId) {
          const nw = await pool.query('INSERT INTO wallets (id_user, wallet_type, balance_kigo) VALUES ($1, $2, $3) RETURNING id_wallet', [passengerId, 'passenger', 1000]);
          pWalletId = nw.rows[0].id_wallet;
        }
        if (!dWalletId) {
          const nw = await pool.query('INSERT INTO wallets (id_user, wallet_type, balance_kigo) VALUES ($1, $2, $3) RETURNING id_wallet', [driverUserId, 'driver', 0]);
          dWalletId = nw.rows[0].id_wallet;
        }
        
        // Process transaction
        if (pWalletId && dWalletId) {
          const amount = trip.total_kigo || 50;
          
          await pool.query('BEGIN');
          // insert transaction
          await pool.query(
            `INSERT INTO transactions (id_trip, from_wallet_id, to_wallet_id, amount_kigo, tx_type, status)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [trip.id_trip, pWalletId, dWalletId, amount, 'ride_payment', 'completed']
          );
          
          // update wallets
          await pool.query('UPDATE wallets SET balance_kigo = balance_kigo - $1 WHERE id_wallet = $2', [amount, pWalletId]);
          await pool.query('UPDATE wallets SET balance_kigo = balance_kigo + $1 WHERE id_wallet = $2', [amount, dWalletId]);
          
          await pool.query('COMMIT');
        }
      }
    }
    
    res.json({ status: 'ok', message: 'Ride completed successfully' });
  } catch (err) {
    await pool.query('ROLLBACK');
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


// Get tracking info for user
router.get('/tracking/:rideId', async (req, res) => {
  try {
    const { rideId } = req.params;
    if (!rideId || rideId === 'undefined' || isNaN(Number(rideId))) {
       console.error(`[API] /tracking/:rideId - Invalid rideId: ${rideId}`);
       return res.status(400).json({ error: 'Invalid ride ID' });
    }
    const result = await pool.query(`
      SELECT 
        r.id_ride,
        r.status,
        r."Diem_don",
        r."Diem_den",
        v.location as vehicle_location,
        v.name_vehicle,
        driver.name as driver_name,
        driver.phone as driver_phone,
        driver.avatar_url as driver_avatar,
        '5.0' as driver_rating,
        passenger.name as passenger_name,
        passenger.phone as passenger_phone,
        passenger.avatar_url as passenger_avatar
      FROM rides r
      JOIN vehicles v ON r.id_vehicle = v.id_vehicle
      JOIN users driver ON v.id_user = driver.id_user
      JOIN users passenger ON r.id_user = passenger.id_user
      WHERE r.id_ride = $1
    `, [rideId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    
    const data = result.rows[0];
    if (typeof data.vehicle_location === 'string') {
      try { data.vehicle_location = JSON.parse(data.vehicle_location); } catch(e){}
    }
    if (typeof data.Diem_don === 'string') {
      try { data.Diem_don = JSON.parse(data.Diem_don); } catch(e){}
    }
    if (typeof data.Diem_den === 'string') {
      try { data.Diem_den = JSON.parse(data.Diem_den); } catch(e){}
    }
    
    // Parse name_vehicle to get brand, color, plate
    // Format is usually: Brand Model Color - Plate OR Brand Model - Plate
    data.brand = 'Không rõ';
    data.color = '';
    data.plate = '';
    if (data.name_vehicle) {
        const parts = data.name_vehicle.split(' - ');
        if (parts.length >= 2) {
            data.plate = parts.pop();
            const rest = parts.join(' - ');
            // Try to extract color (last word if not a model number maybe, just use as brand/color)
            data.brand = rest;
        } else {
            data.brand = data.name_vehicle;
        }
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get tracking info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
