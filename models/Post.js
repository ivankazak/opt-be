const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const PostSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    url: {
      type: String,
      required: [true, "can't be blank"],
    },
    media: [String],
    title: String,
    content: {
      type: String,
      required: [true, "can't be blank"],
    },
    corpid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Corporate',
      required: [true, "can't be blank"],
    },
    goals: [{ type: String, points_in: Number, points_out: Number }],
    status: String,
    expireAt: Date,
    tags: [String],
    stats: {
      shares: String,
      points: String,
    },
  },
  { timestamps: true }
);

PostSchema.plugin(autoIncrement.plugin, { model: 'Post', field: 'id' });

module.exports = mongoose.model('Post', PostSchema);
