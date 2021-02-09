const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    name: String,
    mobile: {
      type: String,
      unique: true,
      required: [true, "can't be blank"],
    },
    password: String,
    status: String,
    balance: Number,
    email: String,
    details: String,
    affiliater_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    language: {
      type: String,
      default: 'EN',
    },
    rate: {
      type: Number,
      default: 0,
    },
    image: String,
    otp: String,
    role: String,
  },
  { timestamps: true }
);

UserSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'id' });

module.exports = mongoose.model('User', UserSchema);
