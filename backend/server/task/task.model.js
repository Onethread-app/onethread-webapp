const mongoose = require('mongoose');

const { Schema } = mongoose;

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
      required: true,
    },
    priority: {
      type: Number,
      enum: [0, 1, 2, 3, 4],
      default: 2,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    dueDate: {
      type: Date,
    },
    file: [
      {
        type: [Schema.Types.ObjectId],
        ref: 'File',
      },
    ],
    timeSpent: {
      type: Number,
      default: 0,
    },
    columnId: {
      type: Schema.Types.ObjectId,
      ref: 'BoardColumn',
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    removed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

TaskSchema.index({ project: 1 }, { unique: true });

module.exports = mongoose.model('Task', TaskSchema);
