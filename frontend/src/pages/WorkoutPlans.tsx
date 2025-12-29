import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { workoutAPI } from '../lib/api';
import { Dumbbell, Calendar, Clock, Plus, Trash2, Edit2 } from 'lucide-react';
import Modal from '../components/Modal';

interface Workout {
  _id: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  date: string;
  user: string;
}

export default function WorkoutPlans() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
  const [newWorkout, setNewWorkout] = useState({
    workoutType: '',
    duration: '',
    caloriesBurned: ''
  });

  useEffect(() => {
    if (user) {
      loadWorkouts();
    }
  }, [user]);

  const loadWorkouts = async () => {
    try {
      const response = await workoutAPI.getAll();
      console.log('Workouts response:', response);
      setWorkouts(response.workouts || []);
    } catch (error) {
      console.error('Failed to load workouts:', error);
    }
  };

  const handleAddWorkout = async () => {
    if (!newWorkout.workoutType.trim()) return;

    try {
      const response = await workoutAPI.create({
        workoutType: newWorkout.workoutType,
        duration: parseInt(newWorkout.duration) || 30,
        caloriesBurned: parseInt(newWorkout.caloriesBurned) || 150,
        date: new Date().toISOString()
      });
      
      // Handle both direct object and nested object responses
      const newWorkoutItem = response.workout || response;
      setWorkouts([newWorkoutItem, ...workouts]);
      setNewWorkout({
        workoutType: '',
        duration: '',
        caloriesBurned: ''
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add workout:', error);
    }
  };

  const handleDeleteWorkout = async () => {
    if (!workoutToDelete) return;

    try {
      await workoutAPI.delete(workoutToDelete);
      setWorkouts(workouts.filter(workout => workout._id !== workoutToDelete));
      setWorkoutToDelete(null);
      setShowDeleteConfirmModal(false);
    } catch (error) {
      console.error('Failed to delete workout:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workout Tracking</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Workout</span>
        </button>
      </div>

      {/* Workout Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Total Workouts</p>
              <h2 className="text-2xl font-bold">{workouts.length}</h2>
            </div>
            <Dumbbell className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Total Duration</p>
              <h2 className="text-2xl font-bold">
                {workouts.reduce((total, workout) => total + workout.duration, 0)} min
              </h2>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Calories Burned</p>
              <h2 className="text-2xl font-bold">
                {workouts.reduce((total, workout) => total + workout.caloriesBurned, 0)} kcal
              </h2>
            </div>
            <Calendar className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Workout List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Workouts</h2>
        </div>
        <div className="divide-y">
          {workouts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Dumbbell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No workouts recorded yet.</p>
              <p className="text-sm">Add your first workout to get started!</p>
            </div>
          ) : (
            workouts.map(workout => (
              <div key={workout._id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{workout.type}</h3>
                    <p className="text-sm text-gray-500">
                      {workout.duration} min • {workout.caloriesBurned} calories
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(workout.date)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setWorkoutToDelete(workout._id);
                    setShowDeleteConfirmModal(true);
                  }}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Workout Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Workout"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workout Type
            </label>
            <input
              type="text"
              value={newWorkout.workoutType}
              onChange={(e) => setNewWorkout({ ...newWorkout, workoutType: e.target.value })}
              placeholder="e.g., Running, Weight Training, Yoga"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={newWorkout.duration}
              onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
              placeholder="30"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calories Burned
            </label>
            <input
              type="number"
              value={newWorkout.caloriesBurned}
              onChange={(e) => setNewWorkout({ ...newWorkout, caloriesBurned: e.target.value })}
              placeholder="150"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddWorkout}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Workout
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        title="Delete Workout"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this workout? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteConfirmModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteWorkout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}