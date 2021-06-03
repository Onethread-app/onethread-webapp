// Reference: https://docs.google.com/document/d/1yGg5DUbqOrw1aCA5u1s2VCRL_dFu6LQOvbDLamgl9bM/edit#
const Joi = require('@hapi/joi');

const schema = {
  firstName: Joi.string().trim().lowercase().min(2).max(32),
  lastName: Joi.string().required().lowercase().min(2).max(32),
  email: Joi.string()
    .regex(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
    .lowercase()
    .min(3)
    .max(62),
  password: Joi.string()
    .regex(
      /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/,
    )
    .required(),
  isAccountVerified: Joi.boolean(),
  birthDate: Joi.date(),
  contactNo: Joi.string(),
  bloodGroup: Joi.string().valid([
    'A+',
    'A-',
    'O+',
    'O-',
    'AB+',
    'AB-',
    'B+',
    'B-',
  ]),
  location: Joi.string().allow('').max(120),
  position: Joi.string().allow('').max(32),
  about: Joi.string().max(2000).allow(''),
  gender: Joi.string().valid(['male', 'female', 'others']),
  refreshToken: Joi.string(),
  pushSubscription: Joi.string(),
  subscriptionId: Joi.string(),
};
module.exports = {
  register: Joi.object().keys({
    body: Joi.object().keys({
      firstName: schema.firstName.required(),
      lastName: schema.lastName,
      email: schema.email,
      password: schema.password,
      confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required(),
      birthDate: schema.birthDate.required(),
      isAccountVerified: schema.isAccountVerified.required(),
      // contactNo: schema.contactNo,
      // .regex(/^(\+?(880)[0-9]{10})$/)
      // // .required()
      // .error((error) => {
      //   return {
      //     message: 'contactNo is not a valid format',
      //   };
      // }),
    }),
  }),
  login: Joi.object().keys({
    body: Joi.object().keys({
      email: schema.email.required(),
      password: schema.password.required(),
      pushSubscription: schema.pushSubscription.required(),
    }),
  }),
  update: Joi.object().keys({
    body: Joi.object().keys({
      contactNo: schema.contactNo,
      birthDate: schema.birthDate,
      bloodGroup: schema.bloodGroup,
      location: schema.location,
      position: schema.position,
      about: schema.about,
      gender: schema.gender,
      secondaryEmail: schema.email.allow(''),
    }),
  }),
  resetPassword: Joi.object().keys({
    body: Joi.object().keys({
      password: schema.password,
      token: Joi.string(),
    }),
  }),
  changePassword: Joi.object().keys({
    body: Joi.object().keys({
      newPassword: schema.password,
      oldPassword: schema.password,
    }),
  }),
  inviteSignup: Joi.object().keys({
    body: Joi.object().keys({
      email: schema.email.required(),
    }),
  }),
  logout: Joi.object().keys({
    body: Joi.object().keys({
      refreshToken: schema.refreshToken,
      subscriptionId: schema.subscriptionId,
    }),
  }),
};
