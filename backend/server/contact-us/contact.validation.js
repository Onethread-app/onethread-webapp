const Joi = require('@hapi/joi');

module.exports = {
  create: Joi.object().keys({
    body: Joi.object().keys({
      name: Joi.string().max(32).required(),
      email: Joi.string()
        .regex(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
        .lowercase()
        .min(3)
        .max(62)
        .required()
        .error(() => {
          return {
            success: false,
            message: 'mail id is not valid format',
          };
        }),
      subject: Joi.string().max(500).allow(''),
      message: Joi.string().max(5000).allow(''),
    }),
  }),
};
