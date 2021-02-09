const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const CorporateSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "can't be blank"],
    },
    password: String,
    mobile: String,
    status: String,
    balance: Number,
    details: String,
  },
  { timestamps: true }
);

CorporateSchema.plugin(autoIncrement.plugin, { model: 'Corporate', field: 'id' });

module.exports = mongoose.model('Corporate', CorporateSchema);
