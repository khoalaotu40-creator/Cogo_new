import re

with open('src/components/driver/MapSection.tsx', 'r') as f:
    content = f.read()

# Add imports for useState and useEffect
if "import { useState, useEffect } from 'react';" not in content:
    content = "import { useState, useEffect } from 'react';\n" + content

# Add state to MapSection
state_code = """
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  useEffect(() => {
    if (acceptedRideData) {
      const fetchRoute = async () => {
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${acceptedRideData.vehicle_location.longitude},${acceptedRideData.vehicle_location.latitude};${acceptedRideData.user_location.lng},${acceptedRideData.user_location.lat}?overview=full&geometries=geojson`
          );
          const data = await response.json();
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const coords = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
            setRouteCoordinates(coords);
          }
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      };
      fetchRoute();
    }
  }, [acceptedRideData]);
"""

content = content.replace("export function MapSection({", "export function MapSection({\n  isOnline,\n  isLocating,\n  locationText,\n  acceptedRideData,\n  onToggleConnect\n}: MapSectionProps) {\n" + state_code + "\n  return (")
# Remove the old function declaration part that was double included
content = re.sub(r'export function MapSection\(\{\n  isOnline,\n  isLocating,\n  locationText,\n  acceptedRideData,\n  onToggleConnect\n\}: MapSectionProps\) \{\n.*?\n  return \(', 
                 'export function MapSection({\n  isOnline,\n  isLocating,\n  locationText,\n  acceptedRideData,\n  onToggleConnect\n}: MapSectionProps) {' + state_code + '\n  return (', 
                 content, flags=re.DOTALL)

# Update the Polyline
old_polyline = """<Polyline positions={[
                [acceptedRideData.vehicle_location.latitude, acceptedRideData.vehicle_location.longitude],
                [acceptedRideData.user_location.lat, acceptedRideData.user_location.lng]
              ]} color="#00A550" weight={4} dashArray="10, 10" />"""
              
new_polyline = """<Polyline positions={routeCoordinates.length > 0 ? routeCoordinates : [
                [acceptedRideData.vehicle_location.latitude, acceptedRideData.vehicle_location.longitude],
                [acceptedRideData.user_location.lat, acceptedRideData.user_location.lng]
              ]} color="#00A550" weight={5} />"""

content = content.replace(old_polyline, new_polyline)

with open('src/components/driver/MapSection.tsx', 'w') as f:
    f.write(content)

