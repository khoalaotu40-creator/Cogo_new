with open('src/components/driver/VehicleRegistrationScreen.tsx', 'r') as f:
    content = f.read()

content = content.replace("JSON.stringify({", "JSON.stringify({\n          driver_id: JSON.parse(localStorage.getItem('cogo_user') || '{}')?.id_user || 1,")

with open('src/components/driver/VehicleRegistrationScreen.tsx', 'w') as f:
    f.write(content)
