import pool from "./server/db.js";
async function run() {
  try {
    const res = await pool.query("SELECT data_type FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'driver_id'");
    console.log("vehicles:", res.rows);
    const res2 = await pool.query("SELECT data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'driver_id'");
    console.log("users:", res2.rows);
  } catch(e) { console.error(e) }
  process.exit(0);
}
run();
