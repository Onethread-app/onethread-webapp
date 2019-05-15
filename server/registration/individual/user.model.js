'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;
const jwt = require('jsonwebtoken');
const config = require('../../../config/config');


// defining all the fields of individual account
const individualUserSchema = new mongoose.Schema({
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
  email: {
    type: String,
    unique: true,
    required: true
  },
  mobileNumber: {
    type: String,
    unique: true,
    required: true
  },
  hash: String,
  salt: String,
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
  },
  about: {
    type: String
  }
});


individualUserSchema.pre('save', function (next) {
  let user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

individualUserSchema.methods.comparePassword = function (candidatePassword, cb) {
  console.log(this.password, candidatePassword);
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// generating jwt token
individualUserSchema.methods.generateJwt = function () {
  let expire = new Date();
  expire.setDate(expire.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    name: this.name,
    gender: this.gender,
    skillArea: this.skillArea,
    email: this.email,
    mobileNumber: this.mobileNumber,
    password: this.password,
    bio: this.bio,
    exp: parseInt(expire.getTime() / 1000),
  }, config.jwtSecret); 
};

individualUserSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model('IndividualUser', individualUserSchema);
