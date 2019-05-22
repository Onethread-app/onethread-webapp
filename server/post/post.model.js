const mongoose = require("mongoose");
const Promise = require("bluebird");
const Schema = mongoose.Schema;
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

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
  text: {
    type: String,
    trim: true,
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
  hashtag: [ //will define no of limit 
    {
      type: Schema.ObjectId,
      ref: "Hashtag"
    }
  ],
  tag: [  //will define no of limit 
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
  user: {
    type: Schema.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Post", PostSchema);
