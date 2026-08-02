import re

with open('server/api/rides.ts', 'r') as f:
    content = f.read()

old_logic = """// Complete ride API
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
});"""

new_logic = """// Complete ride API
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
});"""

content = content.replace(old_logic, new_logic)

with open('server/api/rides.ts', 'w') as f:
    f.write(content)
