async function run() {
  const driver_id = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
  
  const createRes = await fetch('http://localhost:3000/api/vehicles/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driver_id, type_vehicle: 'Xe máy', name_vehicle: 'Honda' })
  });
  const data = await createRes.json();
  console.log('Response:', data);
}
run().catch(console.error);
