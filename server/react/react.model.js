const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReactSchema = new mongoose.Schema({
  postRef: {
    type: Schema.ObjectId,
    ref: 'Post'
  },
  ptype: {
    type: [
      {
        type: String,
        enum: ['like', 'respect']
      }
    ],
    default: ['like']
  },
  updated: {
    type: Date
  },
  removed: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  account: {
    type: Schema.ObjectId,
    ref: 'Account'
  }
});

module.exports = mongoose.model('React', ReactSchema);
