const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let tagLimit = function(tagList) {
  return tagList.length <= 10;
};


const DiscussionSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    maxlength: 200,
    required: true
  },
  location: {
    type: String,
    trim: true,
    required: true
  },
  respectCount: {
    type: Number,
    trim: true,
    
  },
  likeCount: {
    type: Number,
    trim: true,
   
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
  
  tag: {
    type: [
      {
        type: Schema.ObjectId,
        ref: 'User'
      }
    ],
    validate: [tagLimit, '{PATH} user exceeds the limit of 10']
  },
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

module.exports = mongoose.model('Dicussion', DiscussionSchema);
