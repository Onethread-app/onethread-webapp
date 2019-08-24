// need to kno moreconst mongoose = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WrokplaceSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  removed: {
    type: Boolean,
    default: false
  },
  updated: {
    type: Date
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

module.exports = mongoose.model('Wrokplace', WrokplaceSchema);
