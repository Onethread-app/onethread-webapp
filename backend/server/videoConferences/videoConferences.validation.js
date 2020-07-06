const Joi = require('@hapi/joi');

const schema = {
  name: Joi.string().max(32),
  link: Joi.string().max(60),
};

module.exports = {
  newRecord: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      link: schema.link.required(),
    }),
  }),
};
