import re

with open('server/api/rides.ts', 'r') as f:
    content = f.read()

old_tracking = """router.get('/tracking/:rideId', async (req, res) => {
  try {
    const { rideId } = req.params;
    const result = await pool.query(`"""

new_tracking = """router.get('/tracking/:rideId', async (req, res) => {
  try {
    const { rideId } = req.params;
    if (!rideId || rideId === 'undefined' || isNaN(Number(rideId))) {
       console.error(`[API] /tracking/:rideId - Invalid rideId: ${rideId}`);
       return res.status(400).json({ error: 'Invalid ride ID' });
    }
    const result = await pool.query(`"""

content = content.replace(old_tracking, new_tracking)

with open('server/api/rides.ts', 'w') as f:
    f.write(content)
