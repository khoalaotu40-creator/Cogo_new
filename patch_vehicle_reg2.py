import re

with open('src/components/driver/VehicleRegistrationScreen.tsx', 'r') as f:
    content = f.read()

old_logic = """      if (!response.ok) {
        throw new Error('Failed to register vehicle');
      }"""

new_logic = """      if (!response.ok) {
        let errStr = '';
        try {
          const errData = await response.json();
          errStr = errData.details || errData.message || '';
        } catch(e) {}
        throw new Error(`Failed to register vehicle: ${errStr}`);
      }"""

content = content.replace(old_logic, new_logic)

with open('src/components/driver/VehicleRegistrationScreen.tsx', 'w') as f:
    f.write(content)
