const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const workoutController = require('../controllers/workoutController');

// Create a workout
router.post('/', authMiddleware, workoutController.createWorkout);
// Get all workouts for a user
router.get('/', authMiddleware, workoutController.getWorkouts);
// Get a specific workout by ID
router.get('/single/:workoutId', authMiddleware, workoutController.getWorkoutById);
// Update a workout
router.put('/:workoutId', authMiddleware, workoutController.updateWorkout);
// Delete a workout
router.delete('/:workoutId', authMiddleware, workoutController.deleteWorkout);

module.exports = router;
