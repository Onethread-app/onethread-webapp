const Joi = require('joi');

module.exports = {
  create: Joi.object().keys({
    body: Joi.object().keys({
      name: Joi.string().max(32).required(),
    }),
  }),
};
