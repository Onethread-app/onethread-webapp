const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: true
  },
<<<<<<< HEAD
=======
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
>>>>>>> master
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

module.exports = mongoose.model("Report", ReportSchema);
