const Joi = require('joi');

module.exports = {
 
  createPost: {
    body: {
      text: Joi.string().required(),
      location: Joi.string()
    }
  },

  updatePost: {
    body: {
      text: Joi.string().required(),
      location: Joi.string()
    },
    params: {
      postId: Joi.string().hex().required()
    }
  }

};