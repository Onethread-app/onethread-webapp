const Joi = require('@hapi/joi');

module.exports = {
  create: Joi.object().keys({
    body: Joi.object().keys({
      issueType: Joi.string().max(40).required(),
      title: Joi.string().max(150).required(),
      issueDetails: Joi.string().max(500).required(),
      imageUrl: Joi.string(),
    }),
  }),
};
