const mongoose = require('mongoose');

const { Schema } = mongoose;

const BoardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
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
  },
  { timestamps: true },
);

module.exports = mongoose.model('Board', BoardSchema);
