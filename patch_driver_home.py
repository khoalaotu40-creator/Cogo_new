import re

with open('src/components/driver/DriverHome.tsx', 'r') as f:
    content = f.read()

old_driverId = """  const currentUser = JSON.parse(localStorage.getItem('cogo_user') || '{}');
  const driverId = currentUser?.driver_id;"""

new_driverId = """  const currentUser = JSON.parse(localStorage.getItem('cogo_user') || '{}');
  const driverId = currentUser?.id_user || currentUser?.driver_id;"""

content = content.replace(old_driverId, new_driverId)

with open('src/components/driver/DriverHome.tsx', 'w') as f:
    f.write(content)
