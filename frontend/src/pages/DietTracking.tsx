import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dietLogAPI } from '../lib/api';
import { DietLog } from '../lib/localStorage';
import { Apple, Plus, PieChart, Coffee, Sun, Moon, Trash2 } from 'lucide-react';
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

  useEffect(() => {
    if (user) {
      loadDietLogs();
    }
  }, [user]);

  const loadDietLogs = async () => {
    try {
      const response = await dietLogAPI.getAll();
      setDietLogs(response);
    } catch (error) {
      console.error('Failed to load diet logs:', error);
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

  const handleAddMeal = async () => {
    if (!newMeal.foodName.trim()) return;

    try {
      const response = await dietLogAPI.create({
        meals: [{
          name: newMeal.foodName,
          calories: parseFloat(newMeal.calories) || 0,
          protein: parseFloat(newMeal.protein) || 0,
          carbs: parseFloat(newMeal.carbs) || 0,
          fat: parseFloat(newMeal.fats) || 0
        }],
        totalCalories: parseFloat(newMeal.calories) || 0
      });
      
      // Handle both direct object and nested object responses
      const newDietLog = response.dietLog || response;
      setDietLogs([newDietLog, ...dietLogs]);
      setNewMeal({
        foodName: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        mealType: 'breakfast'
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add meal:', error);
    }
  };

  const handleDeleteMeal = async () => {
    if (!logToDelete) return;

    try {
      await dietLogAPI.delete(logToDelete);
      setDietLogs(dietLogs.filter(log => log.id !== logToDelete));
      setLogToDelete(null);
      setShowDeleteConfirmModal(false);
    } catch (error) {
      console.error('Failed to delete meal:', error);
    }
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
                            onClick={() => handleDeleteMeal()}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Name
            </label>
            <input
              type="text"
              value={newMeal.foodName}
              onChange={(e) => setNewMeal({ ...newMeal, foodName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter food name"
            />
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
              onClick={handleDeleteMeal}
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