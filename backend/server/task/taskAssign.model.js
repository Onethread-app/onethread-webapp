const mongoose = require('mongoose');

const { Schema } = mongoose;

const TaskAssignSchema = new mongoose.Schema(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    assignedPerson: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('TaskAssign', TaskAssignSchema);
