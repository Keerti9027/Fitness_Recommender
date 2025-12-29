const mongoose = require('mongoose');

const dietLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  meals: [
    {
      name: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    }
  ],
  totalCalories: Number
});

module.exports = mongoose.model('DietLog', dietLogSchema);
