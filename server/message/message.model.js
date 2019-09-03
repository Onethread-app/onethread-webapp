'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// message schema
const message = new Schema(
  {
    text: {
      type: String,
      trim: true,
      required: true
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    }
  },
  {
    timestamps: true
  }
);

let Message = mongoose.model('Message', message);

module.exports = {
  Message
};
