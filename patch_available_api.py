import re

with open('server/api/rides.ts', 'r') as f:
    content = f.read()

old_query = """    const result = await pool.query(
      `SELECT r.*, u.name as driver_name, u.avatar_url, u.phone 
       FROM rides r 
       JOIN users u ON r.id_user = u.id_user 
       WHERE r.type_ride LIKE 'đi ngay%' AND r.id_vehicle IS NULL AND r.status = 'Requested' 
       ORDER BY r.id_ride DESC`
    );"""

new_query = """    const result = await pool.query(
      `SELECT 
         r.*, 
         passenger.name as passenger_name, 
         passenger.avatar_url as passenger_avatar_url, 
         passenger.phone as passenger_phone,
         driver.name as driver_name,
         driver.avatar_url as driver_avatar,
         driver.phone as driver_phone
       FROM rides r 
       JOIN users passenger ON r.id_user = passenger.id_user 
       LEFT JOIN vehicles v ON r.id_vehicle = v.id_vehicle
       LEFT JOIN users driver ON v.id_user = driver.id_user
       WHERE r.type_ride LIKE 'đi ngay%' AND r.status IN ('Requested', 'Arriving', 'In Progress')
       ORDER BY r.id_ride DESC`
    );"""

content = content.replace(old_query, new_query)

with open('server/api/rides.ts', 'w') as f:
    f.write(content)
