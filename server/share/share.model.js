const mongoose = require('mongoose');

const Schema = mongoose.Schema;




const ShareSchema = new mongoose.Schema({
    postRef: {
        type: Schema.ObjectId,
        ref: 'Post'
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

module.exports = mongoose.model('Share', ShareSchema);
