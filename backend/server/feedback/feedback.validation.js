const Joi = require('@hapi/joi');

module.exports = {
  create: Joi.object().keys({
    body: Joi.object().keys({
      improve: Joi.string().max(5000).allow(''),
      usefulFeature: Joi.string().max(5000).allow(''),
      wishFeature: Joi.string().max(5000).allow(''),
      rating: Joi.number().required(),
    }),
  }),
};
