import re

with open('src/components/ride/FindRideForm.tsx', 'r') as f:
    content = f.read()

# Add import
if "import RideTracking" not in content:
    content = content.replace("import RouteMap from './RouteMap';", "import RouteMap from './RouteMap';\nimport RideTracking from './RideTracking';")

# Add state
if "const [trackedRideId" not in content:
    content = content.replace(
        "const [showRouteMap, setShowRouteMap] = useState(false);",
        "const [showRouteMap, setShowRouteMap] = useState(false);\n  const [trackedRideId, setTrackedRideId] = useState<string | null>(null);"
    )

# Update handleCreateRide 
# Old: 
#        let isAccepted = false;
#        while (!isAccepted) {
#            await new Promise(resolve => setTimeout(resolve, 3000));
#            const statusRes = await api.rides.getStatus(rideId);
#            if (statusRes.id_vehicle !== null) {
#                isAccepted = true;
#            }
#        }
#        
#        onSuccess('now');

old_handle = """        let isAccepted = false;
        while (!isAccepted) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const statusRes = await api.rides.getStatus(rideId);
            if (statusRes.id_vehicle !== null) {
                isAccepted = true;
            }
        }
        
        onSuccess('now');"""

new_handle = """        let isAccepted = false;
        while (!isAccepted) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const statusRes = await api.rides.getStatus(rideId);
            if (statusRes.id_vehicle !== null) {
                isAccepted = true;
            }
        }
        
        setTrackedRideId(rideId);"""

content = content.replace(old_handle, new_handle)

# Add rendering logic
# Old:
#  if (showRouteMap && pickupLocation && dropoffLocation) {
#    return (
#      <RouteMap 

old_render_route = """  if (showRouteMap && pickupLocation && dropoffLocation) {
    return (
      <RouteMap"""

new_render_route = """  if (trackedRideId) {
    return <RideTracking rideId={trackedRideId} onBack={() => onSuccess('now')} />;
  }

  if (showRouteMap && pickupLocation && dropoffLocation) {"""

content = content.replace(old_render_route, new_render_route)

with open('src/components/ride/FindRideForm.tsx', 'w') as f:
    f.write(content)

