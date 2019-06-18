<<<<<<< HEAD
const mongoose = require("mongoose");
const Promise = require("bluebird");
const Schema = mongoose.Schema;
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
=======
'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let tagLimit = function (tagList) {
  return tagList.length <= 10;
};

let hashtagLimit = function (hashtagList) {
  return hashtagList.length <= 5;
};
>>>>>>> master

const PostSchema = new mongoose.Schema({
  privacy: {
    type: [
      {
        type: String,
        enum: ["public", "private"]
      }
    ],
    default: ["private"]
  },
<<<<<<< HEAD
=======
  postType: {
    type: [
      {
        type: String,
        enum: ["status", "photo"]
      }
    ],
    default: ["status"]
  },
>>>>>>> master
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
<<<<<<< HEAD
  respect: [
=======
  respect: [  //will use count
>>>>>>> master
    {
      type: Schema.ObjectId,
      ref: "User"
    }
  ],
<<<<<<< HEAD
  like: [
=======
  like: [  //will use count
>>>>>>> master
    {
      type: Schema.ObjectId,
      ref: "User"
    }
  ],
<<<<<<< HEAD
=======
  hashtag:  {
    type: [{
      type: Schema.ObjectId,
      ref: 'Hashtag'
    }],
    validate: [hashtagLimit, '{PATH} user exceeds the limit of 5']
  },
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

module.exports = mongoose.model("Post", PostSchema);
