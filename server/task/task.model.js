const mongoose = require('mongoose');

const { Schema } = mongoose;

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  priority: String,
  assignedPersons: [{
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }],
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  dueDate: Date,
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  columnId: {
    type: Schema.Types.ObjectId,
    ref: 'BoardColumn',
    required: true
  },
  boardId: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  },
  // subtasks: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'SubTask'
  // }]
  // files: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'File'
  // }],
  // reviewers: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Account'
  // }],
  // activity: [{

  // }],
  // watcher: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Account'
  // }]
});

module.exports = mongoose.model('Task', TaskSchema);