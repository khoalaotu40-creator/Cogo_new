import re

with open('server/api/rides.ts', 'r') as f:
    content = f.read()

old_logic = """    // Update ride with vehicle ID
    await pool.query('UPDATE rides SET id_vehicle = $1, status = $2 WHERE id_ride = $3', [actualVehicleId, 'Arriving', id_ride]);
    
    // Get user and vehicle locations"""

new_logic = """    // Update ride with vehicle ID
    await pool.query('UPDATE rides SET id_vehicle = $1, status = $2 WHERE id_ride = $3', [actualVehicleId, 'Arriving', id_ride]);
    
    // Get ride details for creating trip
    const rideDetails = await pool.query('SELECT * FROM rides WHERE id_ride = $1', [id_ride]);
    const rideData = rideDetails.rows[0];
    
    if (rideData) {
      // Calculate a simple distance/kigo based on mock or logic, 
      // here we just use 0 or some base value since we don't have matrix_c_value calculation yet
      const distance = 5.5; // mock distance
      const totalKigo = 50; // mock kigo cost
      
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
    
    // Get user and vehicle locations"""

content = content.replace(old_logic, new_logic)

with open('server/api/rides.ts', 'w') as f:
    f.write(content)
