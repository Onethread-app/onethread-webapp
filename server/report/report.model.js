const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: true
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

module.exports = mongoose.model("Report", ReportSchema);
