'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


// defining all the fields of individual account
const individualUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String, 
    required: true
  },
  skillArea: {
    type: String,
    required: true
  },
  email:{
    type: String,
    unique: true,
    required: true
  },
  mobileNumber:{
    type: String,
    unique: true,
    required: true
  },
  hash: String,
  salt: String
});
// save the reference of password
individualUserSchema.methods.setPassword = (password)=>{
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// password matching against hash
individualUserSchema.methods.validPassword = (password)=>{
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// generating jwt token
individualUserSchema.methods.generateJwt = function() {
  let expire = new Date();
  expire.setDate(expire.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    name: this.name,
    gender: this.gender,
    skillArea: this.skillArea,
    email: this.email,
    mobileNumber: this.mobileNumber,
    exp: parseInt(expire.getTime() / 1000),
  }, "0a6b944d-d2fb-46fc-a85e-0295c986cd9f"); // this token here used for testing purpose
                                              // it should be config with .env and comes from there
};

module.exports = mongoose.model('IndividualUser', individualUserSchema);
