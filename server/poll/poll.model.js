const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const PollSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    maxlength: 200,
    required: true
  },
  opinion: {
    type: Schema.ObjectId,
    ref: 'Opinion'
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
    
    {
      type: Schema.ObjectId,
      ref: 'User'
    }
  ],
  like: [
    
    {
      type: Schema.ObjectId,
      ref: 'User'
    }
  ],
  removed: {
    type: Boolean,
    default: false
  },
  blocked: {
    //after report admin
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

module.exports = mongoose.model('Poll', PollSchema);
