const express = require('express');
const db = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// GET USER PROFILE
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [req.user.user_id]
    );

    if (rows.length === 0) {
      return res.json({ message: 'Profile not created yet' });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// CREATE OR UPDATE PROFILE
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { height_cm, weight_kg, age, gender, fitness_goal, activity_level, bio } = req.body;

    // Check if profile exists
    const [existing] = await db.query(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [req.user.user_id]
    );

    if (existing.length > 0) {
      // UPDATE
      await db.query(
        `UPDATE user_profiles
         SET height_cm = ?, weight_kg = ?, age = ?, gender = ?, fitness_goal = ?, activity_level = ?, bio = ?
         WHERE user_id = ?`,
        [height_cm, weight_kg, age, gender, fitness_goal, activity_level, bio, req.user.user_id]
      );

      return res.json({ message: 'Profile updated' });
    }

    // CREATE
    await db.query(
      `INSERT INTO user_profiles (user_id, height_cm, weight_kg, age, gender, fitness_goal, activity_level, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.user_id, height_cm, weight_kg, age, gender, fitness_goal, activity_level, bio]
    );

    res.json({ message: 'Profile created' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

module.exports = router;
