// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { dietLogAPI } from '../lib/api';
// import { DietLog } from '../lib/localStorage';
// import { Apple, Plus, PieChart, Coffee, Sun, Moon, Trash2 } from 'lucide-react';
// import Modal from '../components/Modal';

// export default function DietTracking() {
//   const { user } = useAuth();
//   const [dietLogs, setDietLogs] = useState<DietLog[]>([]);
//   const [selectedMeal, setSelectedMeal] = useState<string>('all');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
//   const [logToDelete, setLogToDelete] = useState<string | null>(null);
//   const [newMeal, setNewMeal] = useState({
//     foodName: '',
//     calories: '',
//     protein: '',
//     carbs: '',
//     fats: '',
//     mealType: 'breakfast'
//   });

//   useEffect(() => {
//     if (user) {
//       loadDietLogs();
//     }
//   }, [user]);

//   const loadDietLogs = async () => {
//     try {
//       const response = await dietLogAPI.getAll();
//       setDietLogs(response);
//     } catch (error) {
//       console.error('Failed to load diet logs:', error);
//     }
//   };

//   const meals = [
//     { id: 'all', name: 'All Meals', icon: Apple },
//     { id: 'breakfast', name: 'Breakfast', icon: Sun },
//     { id: 'lunch', name: 'Lunch', icon: Coffee },
//     { id: 'dinner', name: 'Dinner', icon: Moon },
//   ];

//   const filteredLogs = selectedMeal === 'all' 
//     ? dietLogs 
//     : dietLogs.filter(log => log.mealType === selectedMeal);

//   const totalNutrition = filteredLogs.reduce((acc, log) => ({
//     calories: (acc.calories || 0) + (log.calories || 0),
//     protein: (acc.protein || 0) + (log.protein || 0),
//     carbs: (acc.carbs || 0) + (log.carbs || 0),
//     fats: (acc.fats || 0) + (log.fats || 0),
//   }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

//   const handleAddMeal = async () => {
//     if (!newMeal.foodName.trim()) return;

//     try {
//       const response = await dietLogAPI.create({
//         meals: [{
//           name: newMeal.foodName,
//           calories: parseFloat(newMeal.calories) || 0,
//           protein: parseFloat(newMeal.protein) || 0,
//           carbs: parseFloat(newMeal.carbs) || 0,
//           fat: parseFloat(newMeal.fats) || 0
//         }],
//         totalCalories: parseFloat(newMeal.calories) || 0
//       });
      
//       // Handle both direct object and nested object responses
//       const newDietLog = response.dietLog || response;
//       setDietLogs([newDietLog, ...dietLogs]);
//       setNewMeal({
//         foodName: '',
//         calories: '',
//         protein: '',
//         carbs: '',
//         fats: '',
//         mealType: 'breakfast'
//       });
//       setShowAddModal(false);
//     } catch (error) {
//       console.error('Failed to add meal:', error);
//     }
//   };

//   const handleDeleteMeal = async () => {
//     if (!logToDelete) return;

//     try {
//       await dietLogAPI.delete(logToDelete);
//       setDietLogs(dietLogs.filter(log => log.id !== logToDelete));
//       setLogToDelete(null);
//       setShowDeleteConfirmModal(false);
//     } catch (error) {
//       console.error('Failed to delete meal:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Diet Tracking</h1>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
//         >
//           <Plus className="w-5 h-5" />
//           <span>Log Meal</span>
//         </button>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
//             <div className="border-b">
//               <div className="flex overflow-x-auto p-4 space-x-4">
//                 {meals.map(meal => (
//                   <button
//                     key={meal.id}
//                     onClick={() => setSelectedMeal(meal.id)}
//                     className={`flex items-center space-x-2 px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
//                       selectedMeal === meal.id
//                         ? 'bg-green-600 text-white'
//                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                     }`}
//                   >
//                     <meal.icon className="w-4 h-4" />
//                     <span>{meal.name}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="p-6">
//               {filteredLogs.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Apple className="w-8 h-8 text-green-600" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2">No meals logged</h3>
//                   <p className="text-gray-600 mb-6">Start tracking your nutrition</p>
//                   <button
//                     onClick={() => setShowAddModal(true)}
//                     className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
//                   >
//                     Log First Meal
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {filteredLogs.map(log => (
//                     <div key={log.id} className="bg-gray-50 rounded-xl p-6">
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="flex items-center space-x-4">
//                           <div className="bg-green-100 p-3 rounded-xl">
//                             <Apple className="w-6 h-6 text-green-600" />
//                           </div>
//                           <div>
//                             <h3 className="text-lg font-semibold">{log.foodName}</h3>
//                             <p className="text-gray-500">{log.mealType}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                           <p className="text-lg font-semibold">{log.calories} kcal</p>
//                           <button
//                             onClick={() => handleDeleteMeal()}
//                             className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
//                           >
//                             <Trash2 className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-3 gap-4">
//                         <div className="bg-white p-3 rounded-lg text-center">
//                           <p className="text-sm text-gray-500">Protein</p>
//                           <p className="font-semibold">{log.protein}g</p>
//                         </div>
//                         <div className="bg-white p-3 rounded-lg text-center">
//                           <p className="text-sm text-gray-500">Carbs</p>
//                           <p className="font-semibold">{log.carbs}g</p>
//                         </div>
//                         <div className="bg-white p-3 rounded-lg text-center">
//                           <p className="text-sm text-gray-500">Fats</p>
//                           <p className="font-semibold">{log.fats}g</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-3xl shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-6 flex items-center">
//             <PieChart className="w-6 h-6 mr-2 text-green-600" />
//             Nutrition Summary
//           </h2>
//           <div className="space-y-6">
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <p className="text-gray-500 mb-1">Total Calories</p>
//               <p className="text-2xl font-bold">{totalNutrition.calories} kcal</p>
//             </div>
//             <div className="space-y-4">
//               <div className="bg-gray-50 p-4 rounded-xl">
//                 <p className="text-gray-500 mb-1">Protein</p>
//                 <p className="text-xl font-semibold">{totalNutrition.protein}g</p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-xl">
//                 <p className="text-gray-500 mb-1">Carbs</p>
//                 <p className="text-xl font-semibold">{totalNutrition.carbs}g</p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-xl">
//                 <p className="text-gray-500 mb-1">Fats</p>
//                 <p className="text-xl font-semibold">{totalNutrition.fats}g</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Modal
//         isOpen={showAddModal}
//         onClose={() => setShowAddModal(false)}
//         title="Log New Meal"
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Food Name
//             </label>
//             <input
//               type="text"
//               value={newMeal.foodName}
//               onChange={(e) => setNewMeal({ ...newMeal, foodName: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Enter food name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Meal Type
//             </label>
//             <select
//               value={newMeal.mealType}
//               onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             >
//               <option value="breakfast">Breakfast</option>
//               <option value="lunch">Lunch</option>
//               <option value="dinner">Dinner</option>
//               <option value="snack">Snack</option>
//             </select>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Calories
//               </label>
//               <input
//                 type="number"
//                 value={newMeal.calories}
//                 onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="kcal"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Protein
//               </label>
//               <input
//                 type="number"
//                 value={newMeal.protein}
//                 onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="grams"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Carbs
//               </label>
//               <input
//                 type="number"
//                 value={newMeal.carbs}
//                 onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="grams"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Fats
//               </label>
//               <input
//                 type="number"
//                 value={newMeal.fats}
//                 onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="grams"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               onClick={() => setShowAddModal(false)}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleAddMeal}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//             >
//               Save Meal
//             </button>
//           </div>
//         </div>
//       </Modal>

//       <Modal
//         isOpen={showDeleteConfirmModal}
//         onClose={() => {
//           setShowDeleteConfirmModal(false);
//           setLogToDelete(null);
//         }}
//         title="Delete Meal"
//       >
//         <div className="space-y-4">
//           <p className="text-gray-600">Are you sure you want to delete this meal? This action cannot be undone.</p>
//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={() => {
//                 setShowDeleteConfirmModal(false);
//                 setLogToDelete(null);
//               }}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDeleteMeal}
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

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage, DietLog } from '../lib/localStorage';
import { foodAPI } from '../lib/api';
import { Apple, Plus, PieChart, Coffee, Sun, Moon, Trash2, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';

export default function DietTracking() {
  const { user } = useAuth();
  const [dietLogs, setDietLogs] = useState<DietLog[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [newMeal, setNewMeal] = useState({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    mealType: 'breakfast'
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingNutrition, setIsLoadingNutrition] = useState(false);
  const [nutritionError, setNutritionError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      const userDietLogs = storage.getDietLogs(user.id);
      setDietLogs(userDietLogs);
    }
  }, [user]);

  // Get unique food names for suggestions
  const getFoodSuggestions = () => {
    if (!user) return [];
    const allLogs = storage.getDietLogs(user.id);
    const uniqueFoodNames = Array.from(new Set(allLogs.map(log => log.foodName.toLowerCase().trim())))
      .map(name => {
        // Find the original case version
        const original = allLogs.find(log => log.foodName.toLowerCase().trim() === name);
        return original ? original.foodName : name;
      });
    return uniqueFoodNames;
  };

  const handleFoodNameChange = (value: string) => {
    setNewMeal({ ...newMeal, foodName: value });
    setNutritionError(null);
    
    const allSuggestions = getFoodSuggestions();
    if (value.trim().length > 0) {
      const filtered = allSuggestions.filter(food => 
        food.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      
      // Debounce API call - fetch nutrition after user stops typing for 1 second
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(async () => {
        const currentValue = value.trim();
        if (currentValue.length > 2) { // Only search if at least 3 characters
          setIsLoadingNutrition(true);
          try {
            const nutrition = await foodAPI.searchFood(currentValue);
            if (nutrition) {
              // Preserve user's food name, only update nutrition values
              setNewMeal(prev => ({
                ...prev,
                foodName: currentValue, // Keep the user's entered food name
                calories: nutrition.calories.toString(),
                protein: nutrition.protein.toString(),
                carbs: nutrition.carbs.toString(),
                fats: nutrition.fats.toString(),
              }));
              setNutritionError(null);
            } else {
              setNutritionError('Nutrition data not found. Please enter manually.');
            }
          } catch (error) {
            console.error('Error fetching nutrition:', error);
            setNutritionError('Unable to fetch nutrition data. Please enter manually.');
          } finally {
            setIsLoadingNutrition(false);
          }
        }
      }, 1000); // Wait 1 second after user stops typing
    } else {
      // Show all suggestions when input is empty
      setSuggestions(allSuggestions);
      setShowSuggestions(allSuggestions.length > 0);
      setIsLoadingNutrition(false);
      setNutritionError(null);
    }
  };

  const selectSuggestion = async (foodName: string) => {
    setShowSuggestions(false);
    setNutritionError(null);
    
    // Auto-fill nutrition if available from previous entry
    if (user) {
      const allLogs = storage.getDietLogs(user.id);
      const previousEntry = allLogs.find(log => 
        log.foodName.toLowerCase() === foodName.toLowerCase()
      );
      if (previousEntry && previousEntry.calories) {
        // Use functional update to ensure we have the latest state
        setNewMeal(prev => ({
          ...prev,
          foodName,
          calories: previousEntry.calories?.toString() || '',
          protein: previousEntry.protein?.toString() || '',
          carbs: previousEntry.carbs?.toString() || '',
          fats: previousEntry.fats?.toString() || '',
        }));
      } else {
        // If not found in previous entries, fetch from API
        setIsLoadingNutrition(true);
        try {
          const nutrition = await foodAPI.searchFood(foodName);
          if (nutrition) {
            // Preserve user's food name, only update nutrition values
            setNewMeal(prev => ({
              ...prev,
              foodName, // Keep the user's entered food name
              calories: nutrition.calories.toString(),
              protein: nutrition.protein.toString(),
              carbs: nutrition.carbs.toString(),
              fats: nutrition.fats.toString(),
            }));
            setNutritionError(null);
          } else {
            // Set food name even if nutrition not found
            setNewMeal(prev => ({
              ...prev,
              foodName,
            }));
            setNutritionError('Nutrition data not found. Please enter manually.');
          }
        } catch (error) {
          console.error('Error fetching nutrition:', error);
          // Set food name even if API fails
          setNewMeal(prev => ({
            ...prev,
            foodName,
          }));
          setNutritionError('Unable to fetch nutrition data. Please enter manually.');
        } finally {
          setIsLoadingNutrition(false);
        }
      }
    }
  };

  const meals = [
    { id: 'all', name: 'All Meals', icon: Apple },
    { id: 'breakfast', name: 'Breakfast', icon: Sun },
    { id: 'lunch', name: 'Lunch', icon: Coffee },
    { id: 'dinner', name: 'Dinner', icon: Moon },
  ];

  const filteredLogs = selectedMeal === 'all' 
    ? dietLogs 
    : dietLogs.filter(log => log.mealType === selectedMeal);

  const totalNutrition = filteredLogs.reduce((acc, log) => ({
    calories: (acc.calories || 0) + (log.calories || 0),
    protein: (acc.protein || 0) + (log.protein || 0),
    carbs: (acc.carbs || 0) + (log.carbs || 0),
    fats: (acc.fats || 0) + (log.fats || 0),
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const handleAddMeal = () => {
    if (!user || !newMeal.foodName) return;

    const meal: DietLog = {
      id: crypto.randomUUID(),
      userId: user.id,
      foodName: newMeal.foodName,
      calories: parseInt(newMeal.calories) || 0,
      protein: parseFloat(newMeal.protein) || 0,
      carbs: parseFloat(newMeal.carbs) || 0,
      fats: parseFloat(newMeal.fats) || 0,
      mealType: newMeal.mealType,
      loggedAt: new Date().toISOString()
    };

    storage.saveDietLog(meal);
    setDietLogs([...dietLogs, meal]);
    setNewMeal({
      foodName: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      mealType: 'breakfast'
    });
    setShowAddModal(false);
    setNutritionError(null);
    setIsLoadingNutrition(false);
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  const handleDeleteMeal = (logId: string) => {
    setLogToDelete(logId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteMeal = () => {
    if (!logToDelete) return;

    storage.deleteDietLog(logToDelete);
    setDietLogs(dietLogs.filter(log => log.id !== logToDelete));
    setLogToDelete(null);
    setShowDeleteConfirmModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Diet Tracking</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Log Meal</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="border-b">
              <div className="flex overflow-x-auto p-4 space-x-4">
                {meals.map(meal => (
                  <button
                    key={meal.id}
                    onClick={() => setSelectedMeal(meal.id)}
                    className={`flex items-center space-x-2 px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
                      selectedMeal === meal.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <meal.icon className="w-4 h-4" />
                    <span>{meal.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Apple className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No meals logged</h3>
                  <p className="text-gray-600 mb-6">Start tracking your nutrition</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Log First Meal
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLogs.map(log => (
                    <div key={log.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 p-3 rounded-xl">
                            <Apple className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{log.foodName}</h3>
                            <p className="text-gray-500">{log.mealType}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="text-lg font-semibold">{log.calories} kcal</p>
                          <button
                            onClick={() => handleDeleteMeal(log.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Protein</p>
                          <p className="font-semibold">{log.protein}g</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Carbs</p>
                          <p className="font-semibold">{log.carbs}g</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Fats</p>
                          <p className="font-semibold">{log.fats}g</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <PieChart className="w-6 h-6 mr-2 text-green-600" />
            Nutrition Summary
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-500 mb-1">Total Calories</p>
              <p className="text-2xl font-bold">{totalNutrition.calories} kcal</p>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500 mb-1">Protein</p>
                <p className="text-xl font-semibold">{totalNutrition.protein}g</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500 mb-1">Carbs</p>
                <p className="text-xl font-semibold">{totalNutrition.carbs}g</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500 mb-1">Fats</p>
                <p className="text-xl font-semibold">{totalNutrition.fats}g</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Log New Meal"
      >
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Name
              {isLoadingNutrition && (
                <span className="ml-2 text-xs text-gray-500 flex items-center inline-flex">
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Fetching nutrition...
                </span>
              )}
            </label>
            <input
              type="text"
              value={newMeal.foodName}
              onChange={(e) => handleFoodNameChange(e.target.value)}
              onFocus={() => {
                const allSuggestions = getFoodSuggestions();
                if (newMeal.foodName.trim().length > 0) {
                  const filtered = allSuggestions.filter(food => 
                    food.toLowerCase().includes(newMeal.foodName.toLowerCase())
                  );
                  setSuggestions(filtered);
                  setShowSuggestions(filtered.length > 0);
                } else {
                  // Show all suggestions when input is focused and empty
                  setSuggestions(allSuggestions);
                  setShowSuggestions(allSuggestions.length > 0);
                }
              }}
              onBlur={() => {
                // Delay hiding suggestions to allow click
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter food name (e.g., apple, chicken breast)"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-green-50 focus:bg-green-50 focus:outline-none"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            {nutritionError && (
              <p className="mt-1 text-xs text-amber-600">{nutritionError}</p>
            )}
            {newMeal.foodName.trim().length > 2 && !isLoadingNutrition && !nutritionError && (
              <p className="mt-1 text-xs text-gray-500">
                Nutrition data will auto-fill when available
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meal Type
            </label>
            <select
              value={newMeal.mealType}
              onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calories
              </label>
              <input
                type="number"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="kcal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Protein
              </label>
              <input
                type="number"
                value={newMeal.protein}
                onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="grams"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carbs
              </label>
              <input
                type="number"
                value={newMeal.carbs}
                onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="grams"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fats
              </label>
              <input
                type="number"
                value={newMeal.fats}
                onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="grams"
              />
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
              onClick={handleAddMeal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Meal
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setLogToDelete(null);
        }}
        title="Delete Meal"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this meal? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteConfirmModal(false);
                setLogToDelete(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteMeal}
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