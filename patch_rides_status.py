import re

with open('server/api/rides.ts', 'r') as f:
    content = f.read()

old_status = """router.get('/status/:rideId', async (req, res) => {
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
});"""

new_status = """router.get('/status/:rideId', async (req, res) => {
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
});"""

content = content.replace(old_status, new_status)

with open('server/api/rides.ts', 'w') as f:
    f.write(content)
