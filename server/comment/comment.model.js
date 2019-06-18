<<<<<<< HEAD
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

=======
'use strict';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let tagLimit = function (tagList) {
  return tagList.length <= 5;
};

>>>>>>> master
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
<<<<<<< HEAD
=======
  tag: {
    type: [{
      type: Schema.ObjectId,
      ref: 'User'
    }],
    validate: [tagLimit, '{PATH} user exceeds the limit of 10']
  },
>>>>>>> master
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
<<<<<<< HEAD
  user: {
    type: Schema.ObjectId,
    ref: "User"
=======
  account: {
    type: Schema.ObjectId,
    ref: "Account"
>>>>>>> master
  }
});

module.exports = mongoose.model("Comment", CommentSchema);
