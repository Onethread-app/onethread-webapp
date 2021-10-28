const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskLabel = new mongoose.Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    label: {
      type: Schema.Types.ObjectId,
      ref: 'Label',
      required: true,
    },
  },
  { timestamps: true },
);

taskLabel.index({ task: 1, label: 1 }, { unique: true });

module.exports = mongoose.model('taskLabel', taskLabel);
