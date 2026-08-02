import pool from "./server/db.js";
async function run() {
  try {
    await pool.query("CREATE SEQUENCE IF NOT EXISTS vehicles_id_vehicle_seq OWNED BY vehicles.id_vehicle");
    await pool.query("SELECT setval('vehicles_id_vehicle_seq', COALESCE((SELECT MAX(id_vehicle) FROM vehicles), 0))");
    await pool.query("ALTER TABLE vehicles ALTER COLUMN id_vehicle SET DEFAULT nextval('vehicles_id_vehicle_seq')");
    console.log("Fixed!");
  } catch(e) { console.error(e) }
  process.exit(0);
}
run();
