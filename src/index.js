const express = require('express');
require('dotenv').config();
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

//Workouts Test Route
const workoutRoutes = require('./routes/workouts');
app.use('/workouts', workoutRoutes);

//Exercise Test Route
const exerciseRoutes = require('./routes/exercises');
app.use('/exercises', exerciseRoutes);

//ExerciseLog Test Route
const exerciseLogRoutes = require('./routes/exerciseLogs');
app.use('/exercise-logs', exerciseLogRoutes);

//userProfiles Test Route
const userProfileRoutes = require('./routes/userProfile');
app.use('/profile', userProfileRoutes);

//Protected Test Route
const authenticateToken = require('./middleware/authMiddleware');

app.get('/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'You accessed a protected route!',
    user: req.user
  });
});

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database test failed' });
  }
});


// Test route
app.get('/', (req, res) => {
  res.json({ message: 'FitTrack Hub API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
