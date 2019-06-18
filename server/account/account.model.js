'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;
const jwt = require('jsonwebtoken');
const config = require('../../config/config');


// defining all the fields of individual account
const accountsSchema = new mongoose.Schema({
 
  email: {
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
  role: {
    type: String,
    enum: ['guest', 'admin', 'company', 'user'],
    default: 'user'
  },
  accountType: {
    type: String,
    enum: ['premium', 'normal']
  },
  accountVerified:{
    type: Boolean, 
    default: false
  }
});


accountsSchema.pre('save', function (next) {
  let account = this;

  // only hash the password if it has been modified (or is new)
  if (!account.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(account.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      account.password = hash;
      next();
    });
  });
});

accountsSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// generating jwt token
accountsSchema.methods.generateJwt = function () {
<<<<<<< HEAD
  // token will expire within 7 days
  //let expire = new Date();
  //expire.setDate(expire.getDate() + 7);

=======
  console.log("lets token create");
>>>>>>> master
  return jwt.sign({
    _id: this._id,
    role: this.role,
  }, config.jwtSecret,{
    expiresIn: 60*60
  }); 
};

module.exports = mongoose.model('Account', accountsSchema);
