// need to kno moreconst mongoose = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new mongoose.Schema({
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
  workplace: {
    type: Schema.ObjectId,
    ref: 'Workplace'
  },
  account: {
    type: Schema.ObjectId,
    ref: 'Account'
  }
});

module.exports = mongoose.model('Room', RoomSchema);
