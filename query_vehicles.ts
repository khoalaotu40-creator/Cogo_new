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
  const res = await pool.query("SELECT conname, pg_get_constraintdef(c.oid) FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace WHERE conrelid = 'vehicles'::regclass;");
  console.log(res.rows);
  process.exit(0);
}
run();
