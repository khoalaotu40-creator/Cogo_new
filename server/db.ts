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
    // 1. Ensure core tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone VARCHAR(20) UNIQUE NOT NULL
      );

      ALTER TABLE users ADD COLUMN IF NOT EXISTS id_user SERIAL;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS background_url TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS intro_text TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS driver_id INT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS location JSONB;

      CREATE TABLE IF NOT EXISTS vehicles (
        id_vehicle UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        id_user INT,
        name_vehicle VARCHAR(255),
        location JSONB,
        list_users JSONB DEFAULT '[]'::jsonb
      );

      CREATE TABLE IF NOT EXISTS rides (
        id_ride SERIAL PRIMARY KEY,
        id_user INT,
        id_vehicle UUID,
        type_ride VARCHAR(100),
        "Diem_don" JSONB,
        "Diem_den" JSONB,
        passengers_pickups JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(50) DEFAULT 'Requested'
      );

      CREATE TABLE IF NOT EXISTS posts (
        post_id SERIAL PRIMARY KEY,
        user_id INT,
        content TEXT NOT NULL,
        departure_point TEXT,
        destination_point TEXT,
        pickup_location JSONB,
        dropoff_location JSONB,
        media_url TEXT,
        ride_frequency VARCHAR(100),
        privacy VARCHAR(50) DEFAULT 'public',
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS post_requests (
        request_id SERIAL PRIMARY KEY,
        post_id INT,
        user_id TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        message TEXT,
        requested_seats INT DEFAULT 1,
        pickup_point JSONB,
        dropoff_point JSONB
      );

      -- Relax foreign keys on post_requests if they exist to allow flexible preset trips and diverse user ID formats
      ALTER TABLE post_requests DROP CONSTRAINT IF EXISTS post_requests_post_id_fkey;
      ALTER TABLE post_requests DROP CONSTRAINT IF EXISTS post_requests_user_id_fkey;
    `);

    // 2. Seed preset posts if missing so queries and joins work seamlessly
    await pool.query(`
      INSERT INTO posts (post_id, user_id, content, departure_point, destination_point, status, created_at)
      VALUES 
        (101, 201, 'Đi học ca sáng, xe 4 chỗ còn trống ghế sau.', 'KTX Khu B, ĐHQG TP.HCM', 'Đại học Công nghệ Thông tin UIT', 'active', CURRENT_TIMESTAMP),
        (102, 202, 'Tiện đường đi làm qua Làng ĐH, đón đúng cổng Vincom.', 'Vincom Lê Văn Việt', 'Làng Đại học Thủ Đức', 'active', CURRENT_TIMESTAMP),
        (103, 203, 'Chở đồ ra bến xe mới, xe 7 chỗ rộng rãi.', 'Cổng sau UIT', 'Bến xe Miền Đông mới', 'active', CURRENT_TIMESTAMP),
        (104, 204, 'Đi sân bay chuyến sáng sớm, ai cùng đường ghép cho rẻ.', 'KTX Khu A, ĐHQG', 'Sân bay Tân Sơn Nhất', 'active', CURRENT_TIMESTAMP),
        (201, 301, 'Cần tìm tài xế hoặc 2 bạn sinh viên đi chung về Quận 1 chiều nay.', 'Cổng chính UIT', 'Chợ Bến Thành, Quận 1', 'active', CURRENT_TIMESTAMP),
        (202, 302, 'Tụi mình có 2 người đi Aeon Bình Tân, cần thêm 1 bạn ghép xe.', 'Làng Đại học Thủ Đức', 'Aeon Mall Bình Tân', 'active', CURRENT_TIMESTAMP)
      ON CONFLICT (post_id) DO NOTHING;
    `);

    console.log('Database tables and preset data initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default pool;
