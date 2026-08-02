const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST || 'aws-1-ap-northeast-2.pooler.supabase.com',
  port: parseInt(process.env.DB_PORT || '6543', 10),
  user: process.env.DB_USER || 'postgres.dhjgmpsfoqlrduolhocq',
  password: process.env.DB_PASS || 'Khoa@0775404040',
  database: process.env.DATABASE || 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const res = await pool.query(`SELECT 
         r.id_ride, r.status, r.id_vehicle,
         passenger.name as passenger_name, 
         driver.name as driver_name
       FROM rides r 
       JOIN users passenger ON r.id_user = passenger.id_user 
       LEFT JOIN vehicles v ON r.id_vehicle = v.id_vehicle
       LEFT JOIN users driver ON v.id_user = driver.id_user
       WHERE r.type_ride LIKE 'đi ngay%' AND r.status IN ('Requested', 'Arriving', 'In Progress')
       ORDER BY r.id_ride DESC`);
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit(0);
}
run();
