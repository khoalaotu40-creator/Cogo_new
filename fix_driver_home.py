import re

with open('src/components/driver/DriverHome.tsx', 'r') as f:
    content = f.read()

# Fix imports
content = content.replace("./types", "../../types")
content = content.replace("./components/", "./")
content = content.replace("export default function App() {", "export default function DriverHome({ onBack }: { onBack?: () => void }) {\n  const currentUser = JSON.parse(localStorage.getItem('cogo_user') || '{}');\n  const driverId = currentUser?.id_user || currentUser?.id || 1;")

# Pass driver_id to fetchVehicles
content = content.replace("fetch('/api/vehicles');", "fetch(`/api/vehicles?driver_id=${driverId}`);")
content = content.replace("JSON.stringify(statusParams)", "JSON.stringify({ ...statusParams, driver_id: driverId })")
content = content.replace("body: JSON.stringify({ id_ride: rideId })", "body: JSON.stringify({ id_ride: rideId, driver_id: driverId })")

# In handleToggleConnect, we also might need to pass driver_id but updateVehicleStatus does it now

# Also add a back button in the map section or somewhere? 
# Maybe just replace the return container
content = content.replace('<div className="min-h-screen bg-gray-100 flex items-center justify-center sm:p-8 font-sans">', '<div className="h-full bg-gray-100 flex items-center justify-center font-sans">')
content = content.replace('<div className="w-full max-w-[420px] bg-[#F5F7F8] h-[100dvh] sm:h-[850px] sm:rounded-[3rem] sm:shadow-2xl relative overflow-hidden flex flex-col sm:border-[10px] sm:border-gray-900">', '<div className="w-full bg-[#F5F7F8] h-full relative overflow-hidden flex flex-col">')

with open('src/components/driver/DriverHome.tsx', 'w') as f:
    f.write(content)

