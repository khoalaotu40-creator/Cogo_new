import re

with open('src/components/driver/MapSection.tsx', 'r') as f:
    content = f.read()

new_useEffect = """
  useEffect(() => {
    if (acceptedRideData) {
      const fetchRoute = async () => {
        try {
          let startLng, startLat, endLng, endLat;
          
          if (acceptedRideData.status === 'Arriving') {
            startLng = acceptedRideData.vehicle_location.longitude;
            startLat = acceptedRideData.vehicle_location.latitude;
            endLng = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lng : acceptedRideData.user_location.lng;
            endLat = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lat : acceptedRideData.user_location.lat;
          } else {
            // In Progress
            startLng = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lng : acceptedRideData.user_location.lng;
            startLat = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lat : acceptedRideData.user_location.lat;
            endLng = acceptedRideData.Diem_den ? acceptedRideData.Diem_den.lng : acceptedRideData.user_location.lng;
            endLat = acceptedRideData.Diem_den ? acceptedRideData.Diem_den.lat : acceptedRideData.user_location.lat;
          }

          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
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

# Replace useEffect
content = re.sub(r'  useEffect\(\(\) => \{.*?  \}, \[acceptedRideData\]\);', new_useEffect.strip(), content, flags=re.DOTALL)


# Update MapContainer center and Markers
new_map = """
          {acceptedRideData ? (() => {
            let startLng, startLat, endLng, endLat;
            if (acceptedRideData.status === 'Arriving') {
              startLng = acceptedRideData.vehicle_location.longitude;
              startLat = acceptedRideData.vehicle_location.latitude;
              endLng = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lng : acceptedRideData.user_location.lng;
              endLat = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lat : acceptedRideData.user_location.lat;
            } else {
              startLng = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lng : acceptedRideData.user_location.lng;
              startLat = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lat : acceptedRideData.user_location.lat;
              endLng = acceptedRideData.Diem_den ? acceptedRideData.Diem_den.lng : acceptedRideData.user_location.lng;
              endLat = acceptedRideData.Diem_den ? acceptedRideData.Diem_den.lat : acceptedRideData.user_location.lat;
            }
            return (
            <MapContainer 
              center={[(startLat + endLat) / 2, (startLng + endLng) / 2]} 
              zoom={13} 
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[startLat, startLng]} icon={vehicleIcon} />
              <Marker position={[endLat, endLng]} icon={userIcon} />
              <Polyline positions={routeCoordinates.length > 0 ? routeCoordinates : [
                [startLat, startLng],
                [endLat, endLng]
              ]} color="#00A550" weight={5} />
            </MapContainer>
            );
          })() : ("""

content = re.sub(r'          \{acceptedRideData \? \(\n            <MapContainer.*?            </MapContainer>\n          \) : \(', new_map, content, flags=re.DOTALL)

with open('src/components/driver/MapSection.tsx', 'w') as f:
    f.write(content)

