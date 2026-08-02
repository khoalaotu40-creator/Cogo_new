import re

with open('src/components/driver/VehicleRegistrationScreen.tsx', 'r') as f:
    content = f.read()

old_logic = """        body: JSON.stringify({
          driver_id: JSON.parse(localStorage.getItem('cogo_user') || '{}')?.driver_id,
          type_vehicle,
          name_vehicle
        })"""

new_logic = """        body: JSON.stringify({
          driver_id: JSON.parse(localStorage.getItem('cogo_user') || '{}')?.id_user,
          type_vehicle,
          name_vehicle
        })"""

content = content.replace(old_logic, new_logic)

with open('src/components/driver/VehicleRegistrationScreen.tsx', 'w') as f:
    f.write(content)
