
const mongoose = require('mongoose');
const Promise = require('bluebird');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');


const PostSchema = new mongoose.Schema({
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
  updated: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now
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
