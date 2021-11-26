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
      type: Schema.Types.ObjectId,
      ref: 'TaskStatus',
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    priority: {
      type: Number,
      enum: [0, 1, 2, 3, 4],
      default: 2,
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
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    parentTask: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Task', TaskSchema);
