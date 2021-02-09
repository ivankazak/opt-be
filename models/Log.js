const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema(
  {
    source: String,
    details: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', LogSchema);
