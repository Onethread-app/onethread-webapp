const mongoose = require('mongoose');

const { Schema } = mongoose;

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: [String],
  assignedPersons: [{
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }],
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  dueDate: Date,
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }
  // files: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'File'
  // }]
});

module.exports = mongoose.model('Task', TaskSchema);