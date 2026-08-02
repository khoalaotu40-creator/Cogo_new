import { Router } from 'express';
import pool from '../db';

const router = Router();

router.post('/location', async (req, res) => {
  try {
    const { latitude, longitude, address, isOnline, driver_id } = req.body;
    
    if (!driver_id) return res.status(400).json({ error: "Missing driver_id" });

    const locationData = JSON.stringify({
      latitude,
      longitude,
      address,
      isOnline,
      timestamp: new Date().toISOString()
    });
    
    // update location where driver_id matches
    const result = await pool.query(`
      UPDATE vehicles
      SET location = $1
      WHERE id_user = $2
      RETURNING *;
    `, [locationData, driver_id]);
    
    res.json({ status: 'ok', data: result.rows[0] });
  } catch (err: any) {
    console.error('Update location error:', err.message || err);
    res.status(500).json({ status: 'error', message: 'Failed to update location', details: err.message || String(err) });
  }
});

router.get('/', async (req, res) => {
  try {
    const driverId = req.query.driver_id;
    if (!driverId) return res.status(400).json({ error: "Missing driver_id" });
    
    const result = await pool.query(`
      SELECT id_vehicle, type_vehicle, name_vehicle 
      FROM vehicles 
      WHERE id_user = $1
    `, [driverId]);
    
    res.json({ status: 'ok', data: result.rows });
  } catch (err: any) {
    console.error('Get vehicles error:', err.message || err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch vehicles', details: err.message || String(err) });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { type_vehicle, name_vehicle, driver_id } = req.body;
    
    if (!type_vehicle || !name_vehicle || !driver_id) {
      return res.status(400).json({ status: 'error', message: 'Missing fields' });
    }
    
    // Check if a vehicle already exists for this driver
    const checkResult = await pool.query(`SELECT id_vehicle FROM vehicles WHERE id_user = $1`, [driver_id]);
    
    let result;
    if (checkResult.rows.length > 0) {
      // Update
      result = await pool.query(`
        UPDATE vehicles 
        SET type_vehicle = $1, name_vehicle = $2
        WHERE id_user = $3
        RETURNING *;
      `, [type_vehicle, name_vehicle, driver_id]);
    } else {
      // Insert
      result = await pool.query(`
        INSERT INTO vehicles (id_user, type_vehicle, name_vehicle)
        VALUES ($1, $2, $3)
        RETURNING *;
      `, [driver_id, type_vehicle, name_vehicle]);
    }
    
    res.json({ status: 'ok', data: result.rows[0] });
  } catch (err: any) {
    console.error('Register vehicle error:', err.message || err);
    res.status(500).json({ status: 'error', message: 'Failed to register vehicle', details: err.message || String(err) });
  }
});

export default router;
