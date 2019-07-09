const mongoose = require("mongoose");
//const Schema = mongoose.Schema;

const HashtagSchema = new mongoose.Schema({
  text: {
    //unique: true,
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
  }
});

module.exports = mongoose.model("Hashtag", HashtagSchema);
