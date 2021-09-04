const mongoose = require('mongoose');

const { Schema } = mongoose;
const SubTaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    dueDate: {
      type: Date,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    assignedMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Account',
      },
    ],
    version: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('SubTask', SubTaskSchema);
