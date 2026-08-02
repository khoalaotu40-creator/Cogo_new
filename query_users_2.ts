import { Pool } from 'pg';
const pool = new Pool({
  host: process.env.DB_HOST || 'aws-1-ap-northeast-2.pooler.supabase.com',
  port: parseInt(process.env.DB_PORT || '6543', 10),
  user: process.env.DB_USER || 'postgres.dhjgmpsfoqlrduolhocq',
  password: process.env.DB_PASS || 'Khoa@0775404040',
  database: process.env.DATABASE || 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const res = await pool.query("SELECT id_user, phone, id, role FROM users LIMIT 1;");
  console.log(res.rows[0]);
  process.exit(0);
}
run();
