with open('server/api/rides.ts', 'r') as f:
    content = f.read()

complete_api = """
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
"""

if "/complete" not in content:
    content = content.replace("export default router;", complete_api + "\nexport default router;")
    with open('server/api/rides.ts', 'w') as f:
        f.write(content)
