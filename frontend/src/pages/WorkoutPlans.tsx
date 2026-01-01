// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { workoutAPI } from '../lib/api';
// import { Dumbbell, Calendar, Clock, Plus, Trash2, Edit2 } from 'lucide-react';
// import Modal from '../components/Modal';

// interface Workout {
//   _id: string;
//   type: string;
//   duration: number;
//   caloriesBurned: number;
//   date: string;
//   user: string;
// }

// export default function WorkoutPlans() {
//   const { user } = useAuth();
//   const [workouts, setWorkouts] = useState<Workout[]>([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
//   const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
//   const [newWorkout, setNewWorkout] = useState({
//     workoutType: '',
//     duration: '',
//     caloriesBurned: ''
//   });

//   useEffect(() => {
//     if (user) {
//       loadWorkouts();
//     }
//   }, [user]);

//   const loadWorkouts = async () => {
//     try {
//       const response = await workoutAPI.getAll();
//       console.log('Workouts response:', response);
//       setWorkouts(response.workouts || []);
//     } catch (error) {
//       console.error('Failed to load workouts:', error);
//     }
//   };

//   const handleAddWorkout = async () => {
//     if (!newWorkout.workoutType.trim()) return;

//     try {
//       const response = await workoutAPI.create({
//         workoutType: newWorkout.workoutType,
//         duration: parseInt(newWorkout.duration) || 30,
//         caloriesBurned: parseInt(newWorkout.caloriesBurned) || 150,
//         date: new Date().toISOString()
//       });
      
//       // Handle both direct object and nested object responses
//       const newWorkoutItem = response.workout || response;
//       setWorkouts([newWorkoutItem, ...workouts]);
//       setNewWorkout({
//         workoutType: '',
//         duration: '',
//         caloriesBurned: ''
//       });
//       setShowAddModal(false);
//     } catch (error) {
//       console.error('Failed to add workout:', error);
//     }
//   };

//   const handleDeleteWorkout = async () => {
//     if (!workoutToDelete) return;

//     try {
//       await workoutAPI.delete(workoutToDelete);
//       setWorkouts(workouts.filter(workout => workout._id !== workoutToDelete));
//       setWorkoutToDelete(null);
//       setShowDeleteConfirmModal(false);
//     } catch (error) {
//       console.error('Failed to delete workout:', error);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Workout Tracking</h1>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
//         >
//           <Plus className="w-5 h-5" />
//           <span>Add Workout</span>
//         </button>
//       </div>

//       {/* Workout Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-xl shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 mb-1">Total Workouts</p>
//               <h2 className="text-2xl font-bold">{workouts.length}</h2>
//             </div>
//             <Dumbbell className="h-8 w-8 text-indigo-500" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 mb-1">Total Duration</p>
//               <h2 className="text-2xl font-bold">
//                 {workouts.reduce((total, workout) => total + workout.duration, 0)} min
//               </h2>
//             </div>
//             <Clock className="h-8 w-8 text-green-500" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 mb-1">Calories Burned</p>
//               <h2 className="text-2xl font-bold">
//                 {workouts.reduce((total, workout) => total + workout.caloriesBurned, 0)} kcal
//               </h2>
//             </div>
//             <Calendar className="h-8 w-8 text-red-500" />
//           </div>
//         </div>
//       </div>

//       {/* Workout List */}
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="p-6 border-b">
//           <h2 className="text-xl font-semibold">Recent Workouts</h2>
//         </div>
//         <div className="divide-y">
//           {workouts.length === 0 ? (
//             <div className="p-8 text-center text-gray-500">
//               <Dumbbell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//               <p>No workouts recorded yet.</p>
//               <p className="text-sm">Add your first workout to get started!</p>
//             </div>
//           ) : (
//             workouts.map(workout => (
//               <div key={workout._id} className="p-6 flex items-center justify-between hover:bg-gray-50">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
//                     <Dumbbell className="w-6 h-6 text-indigo-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">{workout.type}</h3>
//                     <p className="text-sm text-gray-500">
//                       {workout.duration} min • {workout.caloriesBurned} calories
//                     </p>
//                     <p className="text-xs text-gray-400">
//                       {formatDate(workout.date)}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setWorkoutToDelete(workout._id);
//                     setShowDeleteConfirmModal(true);
//                   }}
//                   className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
//                 >
//                   <Trash2 className="w-5 h-5" />
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Add Workout Modal */}
//       <Modal
//         isOpen={showAddModal}
//         onClose={() => setShowAddModal(false)}
//         title="Add New Workout"
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Workout Type
//             </label>
//             <input
//               type="text"
//               value={newWorkout.workoutType}
//               onChange={(e) => setNewWorkout({ ...newWorkout, workoutType: e.target.value })}
//               placeholder="e.g., Running, Weight Training, Yoga"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Duration (minutes)
//             </label>
//             <input
//               type="number"
//               value={newWorkout.duration}
//               onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
//               placeholder="30"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Calories Burned
//             </label>
//             <input
//               type="number"
//               value={newWorkout.caloriesBurned}
//               onChange={(e) => setNewWorkout({ ...newWorkout, caloriesBurned: e.target.value })}
//               placeholder="150"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               onClick={() => setShowAddModal(false)}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleAddWorkout}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//             >
//               Add Workout
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={showDeleteConfirmModal}
//         onClose={() => setShowDeleteConfirmModal(false)}
//         title="Delete Workout"
//       >
//         <div className="space-y-4">
//           <p>Are you sure you want to delete this workout? This action cannot be undone.</p>
//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={() => setShowDeleteConfirmModal(false)}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDeleteWorkout}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage, WorkoutPlan, WorkoutExercise } from '../lib/localStorage';
import { profileAPI } from '../lib/api';
import { getPersonalizedRecommendations, WorkoutPlanRecommendation } from '../lib/exerciseRecommendations';
import { Dumbbell, Calendar, Clock, Plus, ChevronRight, X, Trash2, Sparkles } from 'lucide-react';
import Modal from '../components/Modal';

export default function WorkoutPlans() {
  const { user } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    exercises: [] as WorkoutExercise[]
  });
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });
  const [showPlanSuggestions, setShowPlanSuggestions] = useState(false);
  const [planSuggestions, setPlanSuggestions] = useState<string[]>([]);
  const [showExerciseSuggestions, setShowExerciseSuggestions] = useState(false);
  const [exerciseSuggestions, setExerciseSuggestions] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<WorkoutPlanRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);

  useEffect(() => {
    if (user) {
      const userPlans = storage.getWorkoutPlans(user.id);
      setWorkoutPlans(userPlans);
      
      // Get personalized recommendations
      const profile = profileAPI.get(user.id);
      const recs = getPersonalizedRecommendations(profile);
      setRecommendations(recs);
    }
  }, [user]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Get unique plan names for suggestions
  const getPlanSuggestions = () => {
    if (!user) return [];
    const allPlans = storage.getWorkoutPlans(user.id);
    const uniquePlanNames = Array.from(new Set(allPlans.map(plan => plan.name.toLowerCase().trim())))
      .map(name => {
        const original = allPlans.find(plan => plan.name.toLowerCase().trim() === name);
        return original ? original.name : name;
      });
    return uniquePlanNames;
  };

  // Get unique exercise names for suggestions
  const getExerciseSuggestions = () => {
    if (!user) return [];
    const allPlans = storage.getWorkoutPlans(user.id);
    const allExercises = allPlans.flatMap(plan => plan.exercises);
    const uniqueExerciseNames = Array.from(new Set(allExercises.map(ex => ex.name.toLowerCase().trim())))
      .map(name => {
        const original = allExercises.find(ex => ex.name.toLowerCase().trim() === name);
        return original ? original.name : name;
      });
    return uniqueExerciseNames;
  };

  const handlePlanNameChange = (value: string) => {
    setNewPlan({ ...newPlan, name: value });
    
    const allSuggestions = getPlanSuggestions();
    if (value.trim().length > 0) {
      const filtered = allSuggestions.filter(plan => 
        plan.toLowerCase().includes(value.toLowerCase())
      );
      setPlanSuggestions(filtered);
      setShowPlanSuggestions(filtered.length > 0);
    } else {
      // Show all suggestions when input is empty
      setPlanSuggestions(allSuggestions);
      setShowPlanSuggestions(allSuggestions.length > 0);
    }
  };

  const selectPlanSuggestion = (planName: string) => {
    setNewPlan({ ...newPlan, name: planName });
    setShowPlanSuggestions(false);
    
    // Auto-fill description if available from previous entry
    if (user) {
      const allPlans = storage.getWorkoutPlans(user.id);
      const previousPlan = allPlans.find(plan => 
        plan.name.toLowerCase() === planName.toLowerCase()
      );
      if (previousPlan && previousPlan.description) {
        setNewPlan({
          ...newPlan,
          name: planName,
          description: previousPlan.description
        });
      }
    }
  };

  const handleExerciseNameChange = (value: string) => {
    setCurrentExercise({ ...currentExercise, name: value });
    
    const allSuggestions = getExerciseSuggestions();
    if (value.trim().length > 0) {
      const filtered = allSuggestions.filter(ex => 
        ex.toLowerCase().includes(value.toLowerCase())
      );
      setExerciseSuggestions(filtered);
      setShowExerciseSuggestions(filtered.length > 0);
    } else {
      // Show all suggestions when input is empty
      setExerciseSuggestions(allSuggestions);
      setShowExerciseSuggestions(allSuggestions.length > 0);
    }
  };

  const selectExerciseSuggestion = (exerciseName: string) => {
    setCurrentExercise({ ...currentExercise, name: exerciseName });
    setShowExerciseSuggestions(false);
    
    // Auto-fill sets/reps/weight if available from previous entry
    if (user) {
      const allPlans = storage.getWorkoutPlans(user.id);
      const allExercises = allPlans.flatMap(plan => plan.exercises);
      const previousExercise = allExercises.find(ex => 
        ex.name.toLowerCase() === exerciseName.toLowerCase()
      );
      if (previousExercise) {
        setCurrentExercise({
          name: exerciseName,
          sets: previousExercise.sets?.toString() || '',
          reps: previousExercise.reps?.toString() || '',
          weight: previousExercise.weight?.toString() || '',
        });
      }
    }
  };

  const filteredPlans = workoutPlans.filter(plan => plan.dayOfWeek === selectedDay);

  const handleAddExercise = () => {
    if (!currentExercise.name) return;

    const exercise: WorkoutExercise = {
      id: crypto.randomUUID(),
      name: currentExercise.name,
      sets: parseInt(currentExercise.sets) || undefined,
      reps: parseInt(currentExercise.reps) || undefined,
      weight: parseFloat(currentExercise.weight) || undefined,
      orderPosition: newPlan.exercises.length
    };

    setNewPlan({
      ...newPlan,
      exercises: [...newPlan.exercises, exercise]
    });

    setCurrentExercise({
      name: '',
      sets: '',
      reps: '',
      weight: ''
    });
  };

  const handleRemoveExercise = (id: string) => {
    setNewPlan({
      ...newPlan,
      exercises: newPlan.exercises.filter(ex => ex.id !== id)
    });
  };

  const handleDeletePlan = (planId: string) => {
    setPlanToDelete(planId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeletePlan = () => {
    if (!planToDelete) return;

    storage.deleteWorkoutPlan(planToDelete);
    setWorkoutPlans(workoutPlans.filter(plan => plan.id !== planToDelete));
    setPlanToDelete(null);
    setShowDeleteConfirmModal(false);
  };

  const handleSavePlan = () => {
    if (!user || !newPlan.name) return;

    const plan: WorkoutPlan = {
      id: crypto.randomUUID(),
      userId: user.id,
      name: newPlan.name,
      description: newPlan.description,
      dayOfWeek: selectedDay,
      exercises: newPlan.exercises
    };

    storage.saveWorkoutPlan(plan);
    setWorkoutPlans([...workoutPlans, plan]);
    setNewPlan({
      name: '',
      description: '',
      exercises: []
    });
    setShowAddModal(false);
  };

  const applyRecommendation = (recommendation: WorkoutPlanRecommendation) => {
    const exercises: WorkoutExercise[] = recommendation.exercises.map((ex, index) => ({
      id: crypto.randomUUID(),
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      weight: ex.weight,
      orderPosition: index
    }));

    setNewPlan({
      name: recommendation.name,
      description: recommendation.description,
      exercises: exercises
    });
    setShowRecommendations(false);
    setShowAddModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">💪 Workout Plans</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Plan</span>
        </button>
      </div>

      {/* Personalized Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Personalized Recommendations</h2>
            </div>
            <button
              onClick={() => setShowRecommendations(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-indigo-100 mb-4">
            Based on your profile, goals, and activity level, here are personalized workout recommendations:
          </p>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{rec.name}</h3>
                  <button
                    onClick={() => applyRecommendation(rec)}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
                  >
                    Use This Plan
                  </button>
                </div>
                <p className="text-indigo-100 mb-3">{rec.description}</p>
                <div className="flex items-center space-x-4 text-sm text-indigo-100">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{rec.duration} min</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{rec.frequency}</span>
                  </span>
                  <span>{rec.exercises.length} exercises</span>
                </div>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {rec.exercises.slice(0, 6).map((ex, exIndex) => (
                    <div key={exIndex} className="bg-white/5 rounded-lg p-2 text-sm">
                      <div className="font-medium">{ex.name}</div>
                      <div className="text-xs text-indigo-200">
                        {ex.sets} sets × {ex.reps} reps
                        {ex.weight && ` @ ${ex.weight}kg`}
                      </div>
                    </div>
                  ))}
                  {rec.exercises.length > 6 && (
                    <div className="bg-white/5 rounded-lg p-2 text-sm flex items-center justify-center text-indigo-200">
                      +{rec.exercises.length - 6} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="border-b">
          <div className="flex overflow-x-auto p-4 space-x-4">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedDay === day
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {filteredPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No workouts planned</h3>
              <p className="text-gray-600 mb-6">Create your first workout plan for {selectedDay}</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Workout
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPlans.map(plan => (
                <div key={plan.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 p-3 rounded-xl">
                        <Dumbbell className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                        <p className="text-gray-600">{plan.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {plan.exercises.map(exercise => (
                      <div key={exercise.id} className="bg-white p-4 rounded-lg">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                          {exercise.sets && <span>{exercise.sets} sets</span>}
                          {exercise.reps && <span>{exercise.reps} reps</span>}
                          {exercise.weight && <span>{exercise.weight} kg</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Workout Plan"
      >
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Name
            </label>
            <input
              type="text"
              value={newPlan.name}
              onChange={(e) => handlePlanNameChange(e.target.value)}
              onFocus={() => {
                const allSuggestions = getPlanSuggestions();
                if (newPlan.name.trim().length > 0) {
                  const filtered = allSuggestions.filter(plan => 
                    plan.toLowerCase().includes(newPlan.name.toLowerCase())
                  );
                  setPlanSuggestions(filtered);
                  setShowPlanSuggestions(filtered.length > 0);
                } else {
                  // Show all suggestions when input is focused and empty
                  setPlanSuggestions(allSuggestions);
                  setShowPlanSuggestions(allSuggestions.length > 0);
                }
              }}
              onBlur={(e) => {
                // Only hide suggestions if clicking outside the suggestions dropdown
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (!relatedTarget || !relatedTarget.closest('.suggestions-dropdown')) {
                  setTimeout(() => setShowPlanSuggestions(false), 200);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter plan name"
            />
            {showPlanSuggestions && planSuggestions.length > 0 && (
              <div className="suggestions-dropdown absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {planSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onMouseDown={(e) => {
                      // Prevent blur event from firing
                      e.preventDefault();
                      selectPlanSuggestion(suggestion);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newPlan.description}
              onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter plan description"
              rows={3}
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Exercises</h4>
            <div className="space-y-4">
              {newPlan.exercises.map(exercise => (
                <div key={exercise.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-gray-600">
                      {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}kg
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveExercise(exercise.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 relative">
                  <input
                    type="text"
                    value={currentExercise.name}
                    onChange={(e) => handleExerciseNameChange(e.target.value)}
                    onFocus={() => {
                      const allSuggestions = getExerciseSuggestions();
                      if (currentExercise.name.trim().length > 0) {
                        const filtered = allSuggestions.filter(ex => 
                          ex.toLowerCase().includes(currentExercise.name.toLowerCase())
                        );
                        setExerciseSuggestions(filtered);
                        setShowExerciseSuggestions(filtered.length > 0);
                      } else {
                        // Show all suggestions when input is focused and empty
                        setExerciseSuggestions(allSuggestions);
                        setShowExerciseSuggestions(allSuggestions.length > 0);
                      }
                    }}
                    onBlur={(e) => {
                      // Only hide suggestions if clicking outside the suggestions dropdown
                      const relatedTarget = e.relatedTarget as HTMLElement;
                      if (!relatedTarget || !relatedTarget.closest('.suggestions-dropdown')) {
                        setTimeout(() => setShowExerciseSuggestions(false), 200);
                      }
                    }}
                    placeholder="Exercise name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {showExerciseSuggestions && exerciseSuggestions.length > 0 && (
                    <div className="suggestions-dropdown absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {exerciseSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onMouseDown={(e) => {
                            // Prevent blur event from firing
                            e.preventDefault();
                            selectExerciseSuggestion(suggestion);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="number"
                  value={currentExercise.sets}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, sets: e.target.value })}
                  placeholder="Sets"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  value={currentExercise.reps}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, reps: e.target.value })}
                  placeholder="Reps"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  value={currentExercise.weight}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, weight: e.target.value })}
                  placeholder="Weight (kg)"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleAddExercise}
                  className="col-span-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Add Exercise
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePlan}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Plan
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setPlanToDelete(null);
        }}
        title="Delete Workout Plan"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this workout plan? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteConfirmModal(false);
                setPlanToDelete(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeletePlan}
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