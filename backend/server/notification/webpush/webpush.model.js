const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    pushSubscription: String,
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model(
  'WebPushNotification',
  notificationSchema,
);
