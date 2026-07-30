import { Router } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        p.post_id, 
        p.content, 
        p.departure_point, 
        p.destination_point, 
        p.media_url, 
        p.ride_frequency, 
        p.privacy, 
        p.status, 
        p.created_at,
        u.id_user,
        u.name,
        u.avatar_url,
        (SELECT COUNT(*) FROM post_likes l WHERE l.post_id = p.post_id) as likes_count,
        (SELECT COUNT(*) FROM post_comments c WHERE c.post_id = p.post_id) as comments_count
      FROM posts p
      JOIN users u ON p.user_id = u.id_user
      ORDER BY p.created_at DESC
    `);
    
    // Map to frontend expected format
    const posts = rows.map((row: any) => ({
      id: row.post_id,
      content: row.content,
      departurePoint: row.departure_point,
      destinationPoint: row.destination_point,
      mediaUrl: row.media_url,
      rideFrequency: row.ride_frequency,
      createdAt: row.created_at,
      user: {
        id: row.id_user,
        name: row.name || 'Người dùng',
        avatarUrl: row.avatar_url
      },
      stats: {
        likes: parseInt(row.likes_count),
        comments: parseInt(row.comments_count)
      }
    }));

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { user_id, content, departure_point, destination_point, media_url, ride_frequency, privacy } = req.body;
  
  if (!user_id || !content) {
    return res.status(400).json({ error: "User ID and content are required" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO posts (user_id, content, departure_point, destination_point, media_url, ride_frequency, privacy, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [
        user_id, 
        content, 
        departure_point || null, 
        destination_point || null, 
        media_url || null, 
        ride_frequency || null, 
        privacy || 'public'
      ]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
