const mongoose = require('mongoose');

const { Schema } = mongoose;

const TimeTracker = new Schema(
  {
    startTime: {
      type: Schema.Types.Date,
      required: true,
    },
    duration: {
      type: Schema.Types.Number,
      maxlength: 11,
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    subtask: {
      type: Schema.Types.ObjectId,
      ref: 'SubTask',
      required: false,
    },
    column: {
      type: Schema.Types.ObjectId,
      ref: 'BoardColumn',
      required: true,
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
    version: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('TimeTracker', TimeTracker);
