const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const GiftSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    vendor: {
      type: String,
      required: [true, "can't be blank"],
    },
    points: {
      type: String,
      required: [true, "can't be blank"],
    },
    status: String,
    details: String,
    image: {
      type: String,
      required: [true, "can't be blank"],
    },
    stock: Number,
    expire_at: Date,
  },
  { timestamps: true }
);

GiftSchema.plugin(autoIncrement.plugin, { model: 'Gift', field: 'id' });

module.exports = mongoose.model('Gift', GiftSchema);
