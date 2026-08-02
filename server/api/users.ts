import { Router } from "express";
import pool from "../db";

const router = Router();

// Update user profile (avatar, background, driver_id)
router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const { avatar_url, background_url, driver_id } = req.body;

  try {
    let updateQuery = "UPDATE users SET ";
    const values = [];
    let valueIndex = 1;
    
    if (avatar_url !== undefined) {
      updateQuery += `avatar_url = $${valueIndex}, `;
      values.push(avatar_url);
      valueIndex++;
    }
    
    if (background_url !== undefined) {
      updateQuery += `background_url = $${valueIndex}, `;
      values.push(background_url);
      valueIndex++;
    }

    if (driver_id !== undefined) {
      updateQuery += `driver_id = $${valueIndex}, `;
      values.push(driver_id);
      valueIndex++;
    }
    
    if (values.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    
    updateQuery += ` WHERE id_user = $${valueIndex} RETURNING *`;
    values.push(userId);

    const { rows } = await pool.query(updateQuery, values);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(rows[0]);
  } catch (error: any) {
    console.error("Error updating user:", error.message || error);
    res.status(500).json({ error: "Internal server error", details: error.message || String(error) });
  }
});

export default router;
