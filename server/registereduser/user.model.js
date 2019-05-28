// individual user inSormation
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
  secondaryEmail: {
    type: String
  },
  birthday: {
    type: String
  },

  about: {
    type: String
  },
  bio: {
    type: String,
  },
  account: {
    type: Schema.ObjectId,
    ref: "Account"
  },
  joinedOn: { type: Date, default: new Date() }
  }) 
module.exports = mongoose.model('RegisteredUser', registeredUserSchema);