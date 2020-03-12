
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userNotificationSchema = new Schema({
  read: {
    type: Boolean,
    default: false,
  },
  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
});
module.exports = mongoose.model('UserNotification', userNotificationSchema);
