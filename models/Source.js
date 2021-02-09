const mongoose = require('mongoose');

const SourceSchema = new mongoose.Schema(
  {
    ip: String,
    county: String,
    city: String,
    language: String,
    entry_url: String,
    referral_url: String,
    browser: String,
    technology: String,
    device: String,
    os: String,
    resolution: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Source', SourceSchema);
