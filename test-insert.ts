import pool from "./server/db.js";
async function run() {
  try {
    const r = await pool.query("INSERT INTO vehicles (driver_id, type_vehicle, name_vehicle) VALUES ($1, $2, $3) RETURNING *", [9999, 'Test', 'Test']);
    console.log(r.rows);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
run();
