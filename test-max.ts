import pool from "./server/db.js";
async function run() {
  try {
    const res = await pool.query("SELECT MAX(id_vehicle) FROM vehicles");
    console.log(res.rows);
  } catch(e) { console.error(e) }
  process.exit(0);
}
run();
