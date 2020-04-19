const mongoose = require('mongoose');

const { Schema } = mongoose;

const ActivitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'create',
        'move',
        'edit',
        'fileUpload',
        'assign',
        'subtask',
        'priority',
        'status',
      ],
      required: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Activity', ActivitySchema);
