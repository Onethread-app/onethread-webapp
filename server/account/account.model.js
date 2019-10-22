const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const { Schema } = mongoose;

// defining all the fields of individual account
const accountsSchema = new mongoose.Schema({
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  },

  name: {
    type: String,
    trim: true,
    unique: true,
  },
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  birthDate: {
    type: Date,
  },
  hash: String,
  salt: String,
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['guest', 'admin', 'company', 'user'],
    default: 'user',
  },
  accountType: {
    type: String,
    enum: ['premium', 'normal'],
    default: 'normal',
  },
  accountVerified: {
    type: Boolean,
    default: false,
  },
  contactNo: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    description: 'can be only M,F,Others ',
    enum: ['M', 'F', 'OTHERS'],
  },
  secondaryEmail: {
    type: String,
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'O+', 'O-', 'AB+', 'AB-', 'B+', 'B-'],
  },
  location: {
    type: String,
  },
  about: {
    type: String,
    max: 250,
  },
  skillArea: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillArea',
    },
  ],
  companies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
  ],
  token: {
    type: String,
  },
  // following: [
  //   {
  //     user: {
  //       type: Schema.ObjectId,
  //       ref: 'Account'
  //     }
  //   }
  // ],
  // followers: [
  //   {
  //     user: {
  //       type: Schema.ObjectId,
  //       ref: 'Account'
  //     }
  //   }
  // ],

  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
  pendingFriends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
  sendingFriendList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
  jobExperience: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Jobexperience',
    },
  ],
  education: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Education',
    },
  ],
});

accountsSchema.pre('save', function(next) {
  const account = this;

  // only hash the password if it has been modified (or is new)
  if (!account.isModified('password')) {
    return next();
  }

  // generate a salt
  // promise function ES6 style
  return new Promise((resolve, reject) =>
    // Generate hash's random salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) {
        return reject(err);
      }

      // Now, with the given salt, generate the hash
      bcrypt.hash(account.password, salt, (err, hash) => {
        if (err) {
          return reject(err);
        }

        // Hash generated successfully!
        account.password = hash;
        return resolve(hash);
      });
    }),
  );
});

// TODOS: Convert into promise based function
accountsSchema.methods.comparePassword = function(
  candidatePassword,
  cb,
) {
  // promise based
  // return new Promise((resolve, reject) =>
  //   bcrypt.compare(
  //     candidatePassword,
  //     this.password,
  //     (err, isMatch) => {
  //       if (err) {
  //         return reject(err);
  //       }
  //       return isMatch ? resolve(isMatch) : reject();
  //     },
  //   ),
  // );
  // es5 style
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

// generating jwt token
accountsSchema.methods.generateJwt = function() {
  // const token = new token();
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    config.jwtSecret,
    {
      expiresIn: 60 * 60 * 60 * 24,
    },
  );
};

module.exports = mongoose.model('Account', accountsSchema);
