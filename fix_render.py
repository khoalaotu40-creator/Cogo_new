with open('src/components/ride/FindRideForm.tsx', 'r') as f:
    content = f.read()

old_bad = """  if (showRouteMap && pickupLocation && dropoffLocation) { 
        pickupLocation={pickupLocation}"""

new_fixed = """  if (showRouteMap && pickupLocation && dropoffLocation) {
    return (
      <RouteMap
        pickupLocation={pickupLocation}"""

content = content.replace(old_bad, new_fixed)

with open('src/components/ride/FindRideForm.tsx', 'w') as f:
    f.write(content)
