'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const SaveSchema = new mongoose.Schema({
  postRef: {
    type: Schema.ObjectId,
    ref: 'Post',
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

module.exports = mongoose.model('Save', SaveSchema);
