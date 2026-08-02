import pool from "./server/db.js";

async function run() {
  try {
    await pool.query("ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS driver_id INT");
    await pool.query("ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS type_vehicle VARCHAR(50)");
    await pool.query("ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS name_vehicle VARCHAR(255)");
    
    // In our DB id_vehicle is UUID, but in Cogo_new2 it uses fixed ID '1'. So we'll have to use driver_id instead, or change id_vehicle to string and just pass '1' if we want. Wait, id_vehicle is UUID with gen_random_uuid(). We can insert a specific driver, but UUID is strict.
    console.log("Columns added successfully");
  } catch (err) {
    console.error("Error adding columns:", err);
  }
  process.exit(0);
}
run();
