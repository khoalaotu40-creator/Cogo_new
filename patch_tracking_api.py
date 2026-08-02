with open('server/api/rides.ts', 'r') as f:
    content = f.read()

tracking_api = """
// Get tracking info for user
router.get('/tracking/:rideId', async (req, res) => {
  try {
    const { rideId } = req.params;
    const result = await pool.query(`
      SELECT 
        r.id_ride,
        r.status,
        r."Diem_don",
        r."Diem_den",
        v.location as vehicle_location,
        v.plate,
        v.brand,
        v.color,
        u.name as driver_name,
        u.phone as driver_phone,
        u.avatar_url as driver_avatar,
        u.rating as driver_rating
      FROM rides r
      JOIN vehicles v ON r.id_vehicle = v.id_vehicle
      JOIN users u ON v.id_user = u.id_user
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
    
    res.json(data);
  } catch (error) {
    console.error('Get tracking info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
"""

if "/tracking/:rideId" not in content:
    content = content.replace("export default router;", tracking_api + "\nexport default router;")
    with open('server/api/rides.ts', 'w') as f:
        f.write(content)
