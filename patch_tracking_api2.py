with open('server/api/rides.ts', 'r') as f:
    content = f.read()

old_query = """      SELECT 
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
      WHERE r.id_ride = $1"""

new_query = """      SELECT 
        r.id_ride,
        r.status,
        r."Diem_don",
        r."Diem_den",
        v.location as vehicle_location,
        v.name_vehicle as brand,
        'Biển số (Chưa cập nhật)' as plate,
        'Màu xe (Chưa cập nhật)' as color,
        u.name as driver_name,
        u.phone as driver_phone,
        'https://i.pravatar.cc/150?img=11' as driver_avatar,
        '5.0' as driver_rating
      FROM rides r
      JOIN vehicles v ON r.id_vehicle = v.id_vehicle
      JOIN users u ON v.id_user = u.id_user
      WHERE r.id_ride = $1"""

content = content.replace(old_query, new_query)

with open('server/api/rides.ts', 'w') as f:
    f.write(content)
