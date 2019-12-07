const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new Schema(
  {
    text: {
      type: String,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'url', 'file'],
      default: 'text',
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    removed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

let Message = mongoose.model('Message', MessageSchema);

module.exports = {
  Message,
};
