const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST || 'aws-1-ap-northeast-2.pooler.supabase.com',
  port: parseInt(process.env.DB_PORT || '6543', 10),
  user: process.env.DB_USER || 'postgres.dhjgmpsfoqlrduolhocq',
  password: process.env.DB_PASS || 'Khoa@0775404040',
  database: process.env.DATABASE || 'postgres',
  ssl: { rejectUnauthorized: false }
});
pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'trips';").then(res => console.log('trips:', res.rows));
pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'trip_segments';").then(res => { console.log('trip_segments:', res.rows); process.exit(0); });
