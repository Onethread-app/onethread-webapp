<<<<<<< HEAD
=======
'use strict';
>>>>>>> 0a20eca7dd2eff30d007b24dfdc69cba4d065f36
const Joi = require('joi');
const accountInfo = Joi.object().keys({
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
    .required()
    .error(errors => {
      return {
        message:
          'Password should contain Uppercase, Lowercase, Special character, Number'
      };
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .error(errors => {
      return {
        message: 'Confirm Password should match with Password'
      };
    }),
  contactNo: Joi.string()
    .regex(/\+?(88)?0?1[356789][0-9]{8}/)
    .required()
});
module.exports = {
<<<<<<< HEAD

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

=======
  register: Joi.object().keys({
    body: accountInfo
  })
>>>>>>> 0a20eca7dd2eff30d007b24dfdc69cba4d065f36
};
