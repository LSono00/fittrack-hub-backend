const express = require('express');
const db = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// CREATE WORKOUT
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { workout_name, description } = req.body;

    const [result] = await db.query(
      'INSERT INTO workouts (user_id, workout_name, description) VALUES (?, ?, ?)',
      [req.user.user_id, workout_name, description]
    );

    res.json({ message: 'Workout created', workout_id: result.insertId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

// GET ALL WORKOUTS FOR LOGGED-IN USER
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM workouts WHERE user_id = ?',
      [req.user.user_id]
    );

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// UPDATE WORKOUT
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { workout_name, description } = req.body;

    await db.query(
      'UPDATE workouts SET workout_name = ?, description = ? WHERE workout_id = ? AND user_id = ?',
      [workout_name, description, req.params.id, req.user.user_id]
    );

    res.json({ message: 'Workout updated' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

// DELETE WORKOUT
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM workouts WHERE workout_id = ? AND user_id = ?',
      [req.params.id, req.user.user_id]
    );

    res.json({ message: 'Workout deleted' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

module.exports = router;
