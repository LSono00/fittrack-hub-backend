const express = require('express');
const db = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// CREATE EXERCISE
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { workout_id, exercise_name, sets, reps, weight, notes } = req.body;

    const [result] = await db.query(
      `INSERT INTO exercises (workout_id, exercise_name, sets, reps, weight, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [workout_id, exercise_name, sets, reps, weight, notes]
    );

    res.json({ message: 'Exercise created', exercise_id: result.insertId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create exercise' });
  }
});

// GET EXERCISES FOR A WORKOUT
router.get('/:workout_id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM exercises WHERE workout_id = ?',
      [req.params.workout_id]
    );

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// UPDATE EXERCISE
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { exercise_name, sets, reps, weight, notes } = req.body;

    await db.query(
      `UPDATE exercises
       SET exercise_name = ?, sets = ?, reps = ?, weight = ?, notes = ?
       WHERE exercise_id = ?`,
      [exercise_name, sets, reps, weight, notes, req.params.id]
    );

    res.json({ message: 'Exercise updated' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update exercise' });
  }
});

// DELETE EXERCISE
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM exercises WHERE exercise_id = ?',
      [req.params.id]
    );

    res.json({ message: 'Exercise deleted' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete exercise' });
  }
});

module.exports = router;
