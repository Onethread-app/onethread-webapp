const mongoose = require('mongoose');

const { Schema } = mongoose;
const UserMessageSchema = new Schema(
  {
    read: {
      type: Boolean,
      default: false,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    version: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const UserMessage = mongoose.model('UserMessage', UserMessageSchema);

module.exports = {
  UserMessage,
};
