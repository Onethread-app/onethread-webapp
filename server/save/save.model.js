const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SaveSchema = new mongoose.Schema({
  postRef: {
    type: Schema.ObjectId,
    ref: "Post"
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

module.exports = mongoose.model("Save", SaveSchema);
