// Reference: https://www.w3.org/International/questions/qa-personal-names
const Joi = require('@hapi/joi');
module.exports = {
  register: Joi.object().keys({
    body: Joi.object().keys({
      firstName: Joi.string()
        .lowercase()
        .required()
        .min(3)
        .max(30)
        .error(error => {
          return { success: false, message: `firstName Required` };
        }),
      lastName: Joi.string()
        .required()
        .lowercase()
        .min(3)
        .max(30)
        .error(error => {
          return { success: false, message: `lastName Required` };
        }),
      email: Joi.string()
        .regex(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
        .lowercase()
        .min(3)
        .max(62)
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
        .regex(/^(\+?(880)[0-9]{10})$/)
        .required()
        .error(error => {
          return {
            message: 'contactNo is not a valid format',
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
        .min(3)
        .max(62)
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
      firstName: Joi.string()
        .min(3)
        .max(30),
      lastName: Joi.string()
        .min(3)
        .max(30),
      contactNo: Joi.string().regex(/^(\+?(880)[0-9]{10})$/),
      birthDate: Joi.date()
        .iso()
        .error(error => {
          return { message: 'please, send the date into iso format' };
        }),
      bloodGroup: Joi.string(),
      location: Joi.string()
        .min(3)
        .max(100),
      about: Joi.string().max(200),
      gender: Joi.string().valid(['male', 'female', 'others']),
      secondaryEmail: Joi.string()
        .regex(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
        .email()
        .min(3)
        .max(62)
        .lowercase()
        .error(error => {
          return {
            success: false,
            message: 'mail id is not valid format',
          };
        }),
    }),
  }),
  resetPassword: Joi.object().keys({
    body: Joi.object().keys({
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
      userID: Joi.string(),
    }),
  }),
  search: Joi.string().min(2),
};
