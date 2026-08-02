async function run() {
  const driver_id = 99999; // some dummy value to see if we get the same error
  
  const createRes = await fetch('http://localhost:3000/api/vehicles/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driver_id, type_vehicle: 'Xe máy', name_vehicle: 'Honda' })
  });
  const data = await createRes.json();
  console.log('Response:', data);
}
run().catch(console.error);
