// need to kno moreconst mongoose = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  members: [{
    type: Schema.ObjectId,
    ref: 'Account'
  }],
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
  company: {
    type: Schema.ObjectId,
    ref: 'Company'
  },
  account: {
    type: Schema.ObjectId,
    ref: 'Account'
  }
});

module.exports = mongoose.model('Room', RoomSchema);
