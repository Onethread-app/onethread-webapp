'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;
const jwt = require('jsonwebtoken');


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
    required: true,
    pattern: "^.+\@.+$"
  },
  mobileNumber: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function(v) {
          return /^[0-9]{10}$/.test(v);
      },
    }
  },
  hash: String,
  salt: String
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
    exp: parseInt(expire.getTime() / 1000),
  }, "0a6b944d-d2fb-46fc-a85e-0295c986cd9f"); // this token here used for testing purpose
  // it should be config with .env and comes from there
};

module.exports = mongoose.model('IndividualUser', individualUserSchema);
