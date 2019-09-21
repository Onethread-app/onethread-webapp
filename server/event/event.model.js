// need to kno moreconst mongoose = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  text: {
    type: String,
    trim: true,

    required: true
  },
  location: {
    type: String,
    trim: true,

    required: true
  },

  host: {
    type: String,
    trim: true,

    required: true
  },
  themeImg: {
    type: String,
    trim: true,

    required: true
  },
  respectCount: {
    type: Number,
    trim: true
  },
  likeCount: {
    type: Number,
    trim: true
  },
  respect: [
    //will use count
    {
      type: Schema.ObjectId,
      ref: 'User'
    }
  ],
  like: [
    //will use count
    {
      type: Schema.ObjectId,
      ref: 'User'
    }
  ],

  removed: {
    type: Boolean,
    default: false
  },
  start: {
    type: Date
  },
  end: {
    type: Date
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

module.exports = mongoose.model('Event', EventSchema);
