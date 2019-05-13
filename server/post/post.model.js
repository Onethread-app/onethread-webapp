
const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  updated: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Post', PostSchema);
