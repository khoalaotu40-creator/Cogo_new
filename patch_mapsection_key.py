with open('src/components/driver/MapSection.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "<MapContainer \n              center={[(startLat + endLat) / 2, (startLng + endLng) / 2]}",
    "<MapContainer \n              key={acceptedRideData.status}\n              center={[(startLat + endLat) / 2, (startLng + endLng) / 2]}"
)

with open('src/components/driver/MapSection.tsx', 'w') as f:
    f.write(content)

