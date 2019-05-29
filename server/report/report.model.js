const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: true
  },
  reportType: {
    type: [
      {
        type: String,
        enum: [
          "harmful",
          "violence",
          "threat",
          "annoying",
          "gross",
          "false",
          "abusive",
          "pornography",
          "spam",
          "compromise",
          "offensive",
          "disrespectful",
          "privateExposed",
          "others"
        ]
      }
    ],
    default: ["others"]
  },
  postRef: {
    type: Schema.ObjectId,
    ref: "Post"
  },
  userRef: {
    type: Schema.ObjectId,
    ref: "User"
  },
  commentRef: {
    type: Schema.ObjectId,
    ref: "Comment"
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
  },
  account: {
    type: Schema.ObjectId,
    ref: "Account"
  }
});

module.exports = mongoose.model("Report", ReportSchema);
