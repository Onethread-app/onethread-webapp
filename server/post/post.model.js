const mongoose = require("mongoose");
const Promise = require("bluebird");
const Schema = mongoose.Schema;
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

let tagLimit = function (tagList) {
  console.log(tagList);
  return tagList.length <= 10;
};

let hashtagLimit = function (hashtagList) {
  return hashtagList.length <= 5;
};

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
  postType: {
    type: [
      {
        type: String,
        enum: ["status", "photo"]
      }
    ],
    default: ["status"]
  },
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
  respect: [  //will use count
    {
      type: Schema.ObjectId,
      ref: "User"
    }
  ],
  like: [  //will use count
    {
      type: Schema.ObjectId,
      ref: "User"
    }
  ],
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

module.exports = mongoose.model("Post", PostSchema);
