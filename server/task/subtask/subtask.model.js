const mongoose = require('mongoose');

const { Schema } = mongoose;
const SubTaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  done: {
    type: Boolean,
    default: false
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  version : {
    type : Number ,
    default : 0
  }
}, { timestamps: true });

module.exports = mongoose.model('SubTask', SubTaskSchema);