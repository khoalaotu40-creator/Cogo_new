import re

with open('server/api/rides.ts', 'r') as f:
    content = f.read()

old_query = """      SELECT 
        r.id_ride,
        r.status,
        u.phone, 
        u.location as user_location,
        v.location as vehicle_location"""

new_query = """      SELECT 
        r.id_ride,
        r.status,
        u.phone, 
        u.location as user_location,
        v.location as vehicle_location,
        r."Diem_don",
        r."Diem_den\""""

content = content.replace(old_query, new_query)

# Also parse Diem_don and Diem_den
old_parse = """    const data = rideInfo.rows[0];
    if (data && typeof data.vehicle_location === 'string') {
      try {
        data.vehicle_location = JSON.parse(data.vehicle_location);
      } catch (e) {
        console.error("Failed to parse vehicle_location", e);
      }
    }
    if (data && typeof data.user_location === 'string') {
      try {
        data.user_location = JSON.parse(data.user_location);
      } catch (e) {
        console.error("Failed to parse user_location", e);
      }
    }"""

new_parse = """    const data = rideInfo.rows[0];
    if (data) {
      if (typeof data.vehicle_location === 'string') {
        try { data.vehicle_location = JSON.parse(data.vehicle_location); } catch (e) { console.error(e); }
      }
      if (typeof data.user_location === 'string') {
        try { data.user_location = JSON.parse(data.user_location); } catch (e) { console.error(e); }
      }
      if (typeof data.Diem_don === 'string') {
        try { data.Diem_don = JSON.parse(data.Diem_don); } catch (e) { console.error(e); }
      }
      if (typeof data.Diem_den === 'string') {
        try { data.Diem_den = JSON.parse(data.Diem_den); } catch (e) { console.error(e); }
      }
    }"""

content = content.replace(old_parse, new_parse)

with open('server/api/rides.ts', 'w') as f:
    f.write(content)

