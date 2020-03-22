const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new Schema(
  {
    chatkitId: {
      type: Number,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 3500,
    },
    type: {
      type: String,
      enum: ['text', 'file', 'attachment'],
      default: 'text',
    },
    files: [
      {
        type: Schema.ObjectId,
        ref: 'File',
      },
    ],
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
    discussion: {
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
