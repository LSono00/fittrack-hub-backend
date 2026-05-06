const express = require('express');
const db = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// CREATE LOG ENTRY
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { exercise_id, sets, reps, weight, notes } = req.body;

    const [result] = await db.query(
      `INSERT INTO exercise_logs (exercise_id, sets, reps, weight, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [exercise_id, sets, reps, weight, notes]
    );

    res.json({ message: 'Log entry created', log_id: result.insertId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create log entry' });
  }
});

// GET LOGS FOR AN EXERCISE
router.get('/:exercise_id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM exercise_logs WHERE exercise_id = ? ORDER BY logged_at DESC',
      [req.params.exercise_id]
    );

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// DELETE LOG ENTRY
router.delete('/:log_id', authenticateToken, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM exercise_logs WHERE log_id = ?',
      [req.params.log_id]
    );

    res.json({ message: 'Log entry deleted' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete log entry' });
  }
});

module.exports = router;
