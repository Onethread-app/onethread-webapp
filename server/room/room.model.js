const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: false,
      maxlength: 32,
      required: true,
    },
    members: [
      {
        type: Schema.ObjectId,
        ref: 'Account',
      },
    ],
    project: {
      type: Schema.ObjectId,
      unique: false,
      ref: 'Project',
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

RoomSchema.index({ name: 1, project: 1 }, { unique: true });

let Room = mongoose.model('Room', RoomSchema);

module.exports = {
  Room,
};
