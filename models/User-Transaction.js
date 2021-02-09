const mongoose = require('mongoose');

const UserTransactionSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    points: Number,
    status: String,
    details: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserTransaction', UserTransactionSchema);
