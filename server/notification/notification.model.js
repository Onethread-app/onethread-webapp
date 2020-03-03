
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      'associate',
      'announcement',
      'profile',
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
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
});
module.exports = mongoose.model('Notification', notificationSchema);
