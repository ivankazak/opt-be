const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema(
  {
    userid: {
      required: [true, "can't be blank"],
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    postid: {
      required: [true, "can't be blank"],
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    url: String,
    status: String,
    expire_at: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pin', PinSchema);
