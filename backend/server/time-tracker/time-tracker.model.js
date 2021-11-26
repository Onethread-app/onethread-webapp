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
  },
  { timestamps: true },
);

module.exports = mongoose.model('TimeTracker', TimeTracker);
