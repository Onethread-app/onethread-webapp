
const mongoose = require('mongoose');
const Promise = require('bluebird');
const Schema = mongoose.Schema;
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');


const PostSchema = new mongoose.Schema({
  privacy: {
    type: [{
      type: String,
      enum: ['public', 'private']
    }],
    default: ['private'],
  },
  text: {
    type: String,
    trim: true,
    required: true
  },
  location: {
    type: String,
    trim: true,
    required: true
  },
  respect: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  like: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  updated: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

PostSchema.statics = {
 
  get(id) {
    return this.findById(id)
      .exec()
      .then((post) => {
        if (post) {
          return post;
        }
        const err = new APIError('No such psot exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
 
};


module.exports = mongoose.model('Post', PostSchema);
