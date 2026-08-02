import pool from "./server/db.js";

async function run() {
  try {
    await pool.query("ALTER TABLE posts ADD COLUMN pickup_location JSONB");
    await pool.query("ALTER TABLE posts ADD COLUMN dropoff_location JSONB");
    console.log("Columns added successfully");
  } catch (err) {
    console.error("Error adding columns:", err);
  }
  process.exit(0);
}
run();
