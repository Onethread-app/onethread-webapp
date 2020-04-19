// need to kno moreconst mongoose = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkplaceSchema = new mongoose.Schema({
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
  members: [ {
    type: Schema.ObjectId,
    ref: 'Account'
  }],
  company: {
    type: Schema.ObjectId,
    ref: 'Company',
    reqired: true
  },
  account: {
    type: Schema.ObjectId,
    ref: 'Account'
  }
});

module.exports = mongoose.model('Workplace', WorkplaceSchema);
