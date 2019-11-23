const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: false,
      required: true,
    },
    members: [
      {
        type: Schema.ObjectId,
        ref: 'Account',
      },
    ],
    files: [
      {
        type: Schema.ObjectId,
        ref: 'File',
      },
    ],
    company: {
      type: Schema.ObjectId,
      unique: false,
      ref: 'Company',
    },
    account: {
      type: Schema.ObjectId,
      ref: 'Account',
    },
    removed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

RoomSchema.index({ name: 1, company: 1 }, { unique: true });

let Room = mongoose.model('Room', RoomSchema);

module.exports = {
  Room,
};
