
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  text: {
    type: String,
  
  },
  type: {
    type: String,
    enum: [
      'associate',
      'announcement',
      'profile',
      'companyProfile',
      'project',
      'preface',
      'room',
      'board',
      'team',
      'colleague',
      'task',
      'others',
    ],
    default: 'others',
    required: true,
  },
  associate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Associate',
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  fromColum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BoardColumn',
  },
  toColum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BoardColumn',
  },
  registerUser: {//assign user in task
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
});
module.exports = mongoose.model('Notification', notificationSchema);
