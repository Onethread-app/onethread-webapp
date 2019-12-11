const Joi = require('@hapi/joi');
module.exports = {
  register: Joi.object().keys({
    body: Joi.object().keys({
      firstName: Joi.string()
        .lowercase()
        .required()
        .error(error => {
          return { success: false, message: `recheck` };
        }),
      lastName: Joi.string().required(),
      email: Joi.string()
        .regex(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
        .lowercase()
        .required()
        .error(error => {
          return {
            success: false,
            message: 'mail id is not valid format',
          };
        }),
      password: Joi.string()
        .regex(
          /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/,
        )
        .required()
        .error(error => {
          return {
            success: false,
            message:
              'Password should contain Uppercase, Lowercase, Special character, Number',
          };
        }),
      confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required(),
      contactNo: Joi.string()
        .regex(/^(\+?(88)?0?1[123456789][0-9]{8})$/)
        .required()
        .error(error => {
          return {
            success: false,
            message: 'ContactNo did not match the validation',
          };
        }),
    }),
  }),

  login: Joi.object().keys({
    body: Joi.object().keys({
      email: Joi.string()
        .regex(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
        .email()
        .lowercase()
        .required()
        .error(error => {
          return {
            success: false,
            message: 'mail id is not valid format',
          };
        }),
      password: Joi.string().required(),
    }),
  }),

  update: Joi.object().keys({
    body: Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      contactNo: Joi.string().regex(/\+?(88)?0?1[356789][0-9]{8}/),
      birthday: Joi.date(),
      bloodGroup: Joi.string(),
      location: Joi.string(),
      about: Joi.string(),
      gender: Joi.string().valid(['male', 'female', 'others']),
      secondaryEmail: Joi.string()
        .email()
        .lowercase(),
    }),
  }),
  search: Joi.string().min(1),
};
