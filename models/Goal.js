const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
  {
    type: String,
    points_in: Number,
    points_out: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', GoalSchema);
