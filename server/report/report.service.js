const Report = require("./report.model");
const post = require("../post/post.model");
const mongoose = require("mongoose");

function reviewAction(refrence, type) {
  type = String(type).replace(/\b\w/g, l => l.toUpperCase());

  return mongoose
    .model(type)
    .findByIdAndUpdate(refrence, { $set: { blocked: true } }, { new: true });
}

module.exports = { reviewAction };
