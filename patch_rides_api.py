import re

with open('server/api/rides.ts', 'r') as f:
    content = f.read()

content = content.replace(
    '\'INSERT INTO rides (id_user, type_ride, "Diem_don", "Diem_den") VALUES ($1, $2, $3, $4) RETURNING *\'',
    '\'INSERT INTO rides (id_user, type_ride, "Diem_don", "Diem_den", status) VALUES ($1, $2, $3, $4, $5) RETURNING *\''
)

content = content.replace(
    '[userId, typeRide, JSON.stringify(pickupLocation), JSON.stringify(dropoffLocation)]',
    '[userId, typeRide, JSON.stringify(pickupLocation), JSON.stringify(dropoffLocation), "Requested"]'
)

# Add polling endpoint
poll_endpoint = """
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
"""

if "/status/:rideId" not in content:
    content += "\n" + poll_endpoint

with open('server/api/rides.ts', 'w') as f:
    f.write(content)

