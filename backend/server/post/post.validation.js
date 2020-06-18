const Joi = require('@hapi/joi');

module.exports = {
  createPost: {
    body: {
      postType: Joi.string().valid('status', 'photo').required(),
      privacy: Joi.string().valid('public', 'private').required(),
      text: Joi.string().max(200).required(),
      location: Joi.string(),
      tag: Joi.array()
        .max(10)
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .single(),
      hashtag: Joi.array()
        .max(5)
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .single(),
      respect: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .single(),
      like: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .single(),
    },
  },

  updatePost: {
    body: {
      text: Joi.string().max(200).required(),
      location: Joi.string(),
    },
    params: {
      postId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    },
  },
};
