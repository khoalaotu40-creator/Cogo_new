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
        p.pickup_location,
        p.dropoff_location,
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
      WHERE p.status = 'active'
      ORDER BY p.created_at DESC
    `);
    
    // Map to frontend expected format
    const posts = rows.map((row: any) => ({
      id: row.post_id,
      content: row.content,
      departurePoint: row.departure_point,
      destinationPoint: row.destination_point,
      pickupLocation: row.pickup_location,
      dropoffLocation: row.dropoff_location,
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

router.delete("/:id", async (req, res) => {
  const postId = req.params.id;
  
  try {
    const { rows } = await pool.query(
      `UPDATE posts SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE post_id = $1 RETURNING *`,
      [postId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { user_id, content, departure_point, destination_point, pickup_location, dropoff_location, media_url, ride_frequency, privacy } = req.body;
  
  if (!user_id || !content) {
    return res.status(400).json({ error: "User ID and content are required" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO posts (user_id, content, departure_point, destination_point, pickup_location, dropoff_location, media_url, ride_frequency, privacy, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [
        user_id, 
        content, 
        departure_point || '', 
        destination_point || '', 
        pickup_location ? JSON.stringify(pickup_location) : null,
        dropoff_location ? JSON.stringify(dropoff_location) : null,
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

router.post("/:id/join", async (req, res) => {
  const postId = req.params.id;
  const { user_id, message, requested_seats, pickup_point, dropoff_point } = req.body;
  
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO post_requests (post_id, user_id, status, created_at, message, requested_seats, pickup_point, dropoff_point)
       VALUES ($1, $2, 'pending', CURRENT_TIMESTAMP, $3, $4, $5, $6)
       RETURNING *`,
       [
         postId, 
         user_id, 
         message || '', 
         requested_seats || 1, 
         pickup_point ? JSON.stringify(pickup_point) : null, 
         dropoff_point ? JSON.stringify(dropoff_point) : null
       ]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error("Error creating post request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/requests/:userId", async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const { rows } = await pool.query(
      `SELECT post_id, status FROM post_requests WHERE user_id = $1`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/notifications/:userId", async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const { rows } = await pool.query(
      `SELECT pr.request_id, pr.post_id, pr.user_id as requester_id, pr.status, pr.created_at, pr.message, pr.requested_seats, pr.pickup_point, pr.dropoff_point,
              u.name as requester_name, u.avatar_url as requester_avatar,
              p.content, p.departure_point, p.destination_point
       FROM post_requests pr
       JOIN posts p ON pr.post_id = p.post_id
       JOIN users u ON pr.user_id = u.id_user
       WHERE p.user_id = $1 AND pr.status = 'pending'
       ORDER BY pr.created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/requests/:requestId/respond", async (req, res) => {
  const requestId = req.params.requestId;
  const { status } = req.body; // 'accepted' or 'rejected'
  
  try {
    const { rows } = await pool.query(
      `UPDATE post_requests SET status = $1 WHERE request_id = $2 RETURNING *`,
      [status, requestId]
    );
    const requestData = rows[0];

    if (status === 'accepted' && requestData) {
      let pickupPoint = requestData.pickup_point;
      if (typeof pickupPoint === 'string') {
        try { pickupPoint = JSON.parse(pickupPoint); } catch (e) {}
      }

      if (pickupPoint) {
        // Find post author
        const postRes = await pool.query('SELECT user_id FROM posts WHERE post_id = $1', [requestData.post_id]);
        if (postRes.rows.length > 0) {
          const postUserId = postRes.rows[0].user_id;
          // Find active ride
          const rideRes = await pool.query(
            `SELECT id_ride FROM rides WHERE (id_user = $1 OR id_vehicle IN (SELECT id_vehicle FROM vehicles WHERE id_user = $1)) AND status IN ('Requested', 'Arriving', 'In Progress') ORDER BY id_ride DESC LIMIT 1`,
            [postUserId]
          );
          if (rideRes.rows.length > 0) {
            const rideId = rideRes.rows[0].id_ride;
            await pool.query(
              `UPDATE rides 
               SET passengers_pickups = COALESCE(passengers_pickups, '[]'::jsonb) || $1::jsonb 
               WHERE id_ride = $2`,
              [JSON.stringify([pickupPoint]), rideId]
            );
          }
        }
      }
    }

    res.json(requestData);
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
