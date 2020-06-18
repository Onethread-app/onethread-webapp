const mongoose = require('mongoose');

const { Schema } = mongoose;

const BoardColumnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    positionInBoard: {
      type: Number,
      required: true,
    },
    removed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('BoardColumn', BoardColumnSchema);
