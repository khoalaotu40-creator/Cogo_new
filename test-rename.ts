import pool from "./server/db.js";
async function run() {
  try {
    await pool.query("ALTER TABLE vehicles RENAME COLUMN driver_id TO id_user;");
    console.log("Renamed driver_id to id_user in vehicles");
  } catch(e) { console.error(e) }
  process.exit(0);
}
run();
