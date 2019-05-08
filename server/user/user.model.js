
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  secondaryEmail: {
    type: String,
    required: true
  },
  profile: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
   // required: true
    //match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// userSchema.pre('save', function save(next) {
//   const user = this;
//   if (!user.isModified('password')) { return next(); }
//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(user.password, salt, (err, hash) => {
//       user.salt = hash;
//     if (err) { return next(err); }
//     bcrypt.hash(user.password, salt, (err, hash) => {
//       if (err) { return next(err); }
//       user.password = hash;
//       next();
//     });
//   });
// });
// userSchema.pre('save', function (next) {
//   if (this.password && this.isModified('password')) {
//     this.salt = bcrypt.genSalt(10).toString('base64');
//     this.password = this.bcrypt.hash(user.password, salt);
//   }

//   next();
// });

module.exports = mongoose.model('User', userSchema);
