const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReactSchema = new mongoose.Schema({
  postRef: {
    type: Schema.ObjectId,
    ref: 'Post',
  },
  reactType: {
    type: [
      {
        type: String,
        enum: ['like', 'respect'],
      },
    ],
    default: ['like'],
  },
  refType: {
    type: [
      {
        type: String,
        enum: ['post', 'comment'],
      },
    ],
    default: ['post'],
  },
  updated: {
    type: Date,
  },
  removed: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  account: {
    type: Schema.ObjectId,
    ref: 'Account',
  },
});

module.exports = mongoose.model('React', ReactSchema);
