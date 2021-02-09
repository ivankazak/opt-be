const mongoose = require('mongoose');

const HitSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    corpid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Corporate',
    },
    goal: {
      goal_type: String,
      points_in: Number,
      points_out: Number,
    },
    status: String,
    source: {
      ip: String,
      country: String,
      city: String,
      language: String,
      entry_url: String,
      referral_url: String,
      browser: String,
      technology: String,
      device: String,
      os: String,
      resolution: String,
      created_at: String,
    },
    settled_at: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hit', HitSchema);
