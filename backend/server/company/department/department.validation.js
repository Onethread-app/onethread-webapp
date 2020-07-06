const Joi = require('@hapi/joi');

module.exports = {
  create: Joi.object().keys({
    body: Joi.object().keys({
      name: Joi.string().min(1).max(32).trim().required(),
    }),
  }),
};
