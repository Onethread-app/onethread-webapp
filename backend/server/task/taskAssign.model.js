const mongoose = require('mongoose');

const { Schema } = mongoose;

const TaskAssignSchema = new mongoose.Schema(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    assignedPerson: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('TaskAssign', TaskAssignSchema);
