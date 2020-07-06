const Joi = require('@hapi/joi');

const schema = {
  name: Joi.string().max(32),
  email: Joi.string()
    .regex(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
    .lowercase()
    .min(3)
    .max(62),
  subject: Joi.string().max(500).allow(''),
  message: Joi.string().max(5000),
};

module.exports = {
  create: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      email: schema.email.required(),
      subject: schema.subject,
      message: schema.message.required(),
    }),
  }),
};
