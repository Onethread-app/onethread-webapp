const Joi = require('joi');

module.exports = {
 
  createSave: {
    body: {
      postRef:  Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    }
  }

  // updatePost: {
  //   body: {
  //     text: Joi.string().required(),
  //     location: Joi.string()
  //   },
  //   params: {
  //     postId: Joi.string().hex().required()
  //   }
  // }

};