const mongoose = require('mongoose');

const { Schema } = mongoose;

const BoardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
    },
    color: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6],
      default: 0,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    columns: [
      {
        type: Schema.Types.ObjectId,
        ref: 'BoardColumn',
      },
    ],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Account',
      },
    ],
    removed: {
      type: Boolean,
      default: false,
    },
    version: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Board', BoardSchema);
