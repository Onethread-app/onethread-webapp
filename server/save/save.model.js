
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const SaveSchema = new mongoose.Schema({
  postRef: {
    type: Schema.ObjectId,
    ref: 'Post'
  },
  updated: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Save', SaveSchema);
