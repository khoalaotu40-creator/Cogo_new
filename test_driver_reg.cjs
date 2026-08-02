async function run() {
  const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
  
  const createRes = await fetch(`http://localhost:3000/api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driver_id: 12345 })
  });
  const data = await createRes.json();
  console.log('Response:', data);
}
run().catch(console.error);
