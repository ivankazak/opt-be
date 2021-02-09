const mongoose = require('mongoose');

const CorporationTransactionSchema = new mongoose.Schema(
  {
    corpid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Corporate',
    },
    points: Number,
    status: String,
    details: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('CorporationTransaction', CorporationTransactionSchema);
