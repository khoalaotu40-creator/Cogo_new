import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'aws-1-ap-northeast-2.pooler.supabase.com',
  port: parseInt(process.env.DB_PORT || '6543', 10),
  user: process.env.DB_USER || 'postgres.dhjgmpsfoqlrduolhocq',
  password: process.env.DB_PASS || 'Khoa@0775404040',
  database: process.env.DATABASE || 'postgres',
  ssl: {
    rejectUnauthorized: false // Required for some supabase connections
  }
});

// Initialize table if it doesn't exist
export const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone VARCHAR(20) UNIQUE NOT NULL
      );

      ALTER TABLE users ADD COLUMN IF NOT EXISTS location JSONB;

      CREATE TABLE IF NOT EXISTS vehicles (
        id_vehicle UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        location JSONB,
        list_users JSONB DEFAULT '[]'::jsonb
      );

      CREATE TABLE IF NOT EXISTS rides (
        id_ride UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        id_user UUID REFERENCES users(id) ON DELETE CASCADE,
        id_vehicle UUID REFERENCES vehicles(id_vehicle) ON DELETE SET NULL
      );
    `);
    console.log('Database tables initialized.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default pool;
