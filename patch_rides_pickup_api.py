with open('server/api/rides.ts', 'r') as f:
    content = f.read()

pickup_api = """
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
"""

if "/pickup" not in content:
    content = content.replace("export default router;", pickup_api + "\nexport default router;")
    with open('server/api/rides.ts', 'w') as f:
        f.write(content)
