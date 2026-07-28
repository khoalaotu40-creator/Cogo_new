import { Router } from 'express';

const router = Router();

// Helper to fetch from OpenStreetMap Nominatim
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const HEADERS = {
  'User-Agent': 'Google AI Studio Demo App',
  'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7', // Prefer Vietnamese results
};

/**
 * GET /api/locations/reverse?lat=...&lng=...
 * Reverse Geocoding
 */
router.get('/reverse', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Missing lat or lng parameters' });
    }

    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: HEADERS }
    );
    
    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Format the response to match our Location interface
    const location = {
      id: `rev-${lat}-${lng}`,
      name: data.name || data.address?.road || data.address?.suburb || 'Vị trí hiện tại',
      address: data.display_name,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
    };

    res.json(location);
  } catch (error) {
    console.error('Error in /api/locations/reverse:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/locations/suggest?q=query
 * Autocomplete Suggestions
 */
router.get('/suggest', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid q parameter' });
    }

    // Use countrycodes=vn to limit results to Vietnam for a better experience, 
    // unless you want global results.
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=vn`,
      { headers: HEADERS }
    );
    
    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Format the response to match our Location interface
    const locations = data.map((item: any) => ({
      id: item.place_id.toString(),
      name: item.name || item.display_name.split(',')[0], // Extract first part of address if name is missing
      address: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));

    res.json(locations);
  } catch (error) {
    console.error('Error in /api/locations/suggest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
