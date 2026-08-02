import pool from "./server/db.js";
async function run() {
  try {
    await pool.query(`
      ALTER TABLE vehicles 
      DROP CONSTRAINT IF EXISTS fk_driver_user;
      
      ALTER TABLE vehicles
      ADD CONSTRAINT fk_driver_user
      FOREIGN KEY (driver_id)
      REFERENCES users(driver_id)
      ON DELETE CASCADE;
    `);
    console.log("FK added!");
  } catch(e) { console.error(e) }
  process.exit(0);
}
run();
