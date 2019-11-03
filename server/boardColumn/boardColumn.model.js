const mongoose = require('mongoose');

const { Schema } = mongoose;

const BoardColumnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  taskIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  boardId: {
    type: Schema.Types.ObjectId,
    ref: 'Board'
  },
  positionInBoard: {
    type: Number,
    required: true
  },
  removed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('BoardColumn', BoardColumnSchema);