async function run() {
  const userId = 1;
  const pickupLocation = { lat: 10, lng: 106 };
  const dropoffLocation = { lat: 10.1, lng: 106.1 };
  
  const createRes = await fetch('http://localhost:3000/api/rides', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, pickupLocation, dropoffLocation, typeRide: 'test' })
  });
  const createData = await createRes.json();
  console.log('Created:', createData);
  
  const rideId = createData.ride.id_ride;
  console.log('Ride ID:', rideId);
  
  const statusRes = await fetch(`http://localhost:3000/api/rides/status/${rideId}`);
  console.log('Status HTTP:', statusRes.status);
  const statusData = await statusRes.json();
  console.log('Status Data:', statusData);
}
run().catch(console.error);
