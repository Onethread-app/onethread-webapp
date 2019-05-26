const Joi = require('joi');

module.exports = {
 
  createPost: {
    body: {
      text: Joi.string().max(200).required(),
      location: Joi.string(),
      like: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).single()
    }
  },

  updatePost: {
    body: {
      text: Joi.string().max(200).required(),
      location: Joi.string()
    },
    params: {
      postId: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    }
  }

};