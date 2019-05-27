const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: true
  },
  postRef: {
    type: Schema.ObjectId,
    ref: "Post"
  },
  respect: [
    {
      type: Schema.ObjectId,
      ref: "User"
    }
  ],
  like: [
    {
      type: Schema.ObjectId,
      ref: "User"
    }
  ],
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  account: {
    type: Schema.ObjectId,
    ref: "Account"
  }
});

module.exports = mongoose.model("Comment", CommentSchema);
