const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewSchema = new mongoose.Schema({
  accountRef: {
    type: Schema.ObjectId,
    ref: 'Account'
  },
  text: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    trim: true
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

module.exports = mongoose.model('Review', ReviewSchema);
