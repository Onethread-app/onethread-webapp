const Joi = require('joi');

module.exports = {

  register: Joi.object().keys({
    body: Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string()
        .email()
        .lowercase()
        .required(),
      password: Joi.string()
        .regex(
          /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/
        )
        .required(),
      confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required(),
      contactNo: Joi.string()
        .regex(/\+?(88)?0?1[356789][0-9]{8}/)
        .required()
    })
  }),

};
