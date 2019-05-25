// individual user inSormation
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Account = require('./account.model');
const registeredUserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    description: "can be only M or F",
    required: true
  },
  skillArea: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    unique: true,
    required: true
  },

  about: {
    type: String
  },
  bio: {
    type: String,
  },
  account : {type: mongoose.Schema.Types.ObjectId, ref: 'Account'}
  }) 
module.exports = mongoose.model('RegisteredUser', registeredUserSchema);