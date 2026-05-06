const express = require('express');
const db = require('../config/db');

const router = express.Router();

// CREATE WORKOUT (public)
router.post('/', async (req, res) => {
  try {
    const { workout_name, description } = req.body;

    const [result] = await db.query(
      'INSERT INTO workouts (user_id, workout_name, description) VALUES (?, ?, ?)',
      [1, workout_name, description] // default user_id = 1
    );

    res.json({ message: 'Workout created', workout_id: result.insertId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

// GET ALL WORKOUTS (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM workouts');
    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// UPDATE WORKOUT (public)
router.put('/:id', async (req, res) => {
  try {
    const { workout_name, description } = req.body;

    await db.query(
      'UPDATE workouts SET workout_name = ?, description = ? WHERE workout_id = ?',
      [workout_name, description, req.params.id]
    );

    res.json({ message: 'Workout updated' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

// DELETE WORKOUT (public)
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM workouts WHERE workout_id = ?',
      [req.params.id]
    );

    res.json({ message: 'Workout deleted' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

module.exports = router;
