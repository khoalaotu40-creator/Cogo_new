import re

with open('src/components/driver/MapSection.tsx', 'r') as f:
    content = f.read()

imports_addition = """
import L from 'leaflet';
"""

if "import L from 'leaflet';" not in content:
    content = content.replace(
        "import { Loader2, MapPin, Power } from 'lucide-react';",
        "import L from 'leaflet';\nimport { Loader2, MapPin, Power } from 'lucide-react';"
    )

icons_code = """
  // Create custom icons
  const vehicleIcon = L.divIcon({
    className: 'custom-vehicle-icon',
    html: `
      <div style="background-color: white; border-radius: 50%; padding: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 2px solid #00A550;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00A550" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
          <polyline points="17 2 12 7 7 2"></polyline>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  const userIcon = L.divIcon({
    className: 'custom-user-icon',
    html: `
      <div style="background-color: #00A550; border-radius: 50%; width: 16px; height: 16px; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
"""

if "const vehicleIcon = L.divIcon" not in content:
    content = content.replace(
        "const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);",
        "const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);\n" + icons_code
    )

old_markers = """<Marker position={[acceptedRideData.vehicle_location.latitude, acceptedRideData.vehicle_location.longitude]} />
              <Marker position={[acceptedRideData.user_location.lat, acceptedRideData.user_location.lng]} />"""

new_markers = """<Marker position={[acceptedRideData.vehicle_location.latitude, acceptedRideData.vehicle_location.longitude]} icon={vehicleIcon} />
              <Marker position={[acceptedRideData.user_location.lat, acceptedRideData.user_location.lng]} icon={userIcon} />"""

content = content.replace(old_markers, new_markers)

with open('src/components/driver/MapSection.tsx', 'w') as f:
    f.write(content)

