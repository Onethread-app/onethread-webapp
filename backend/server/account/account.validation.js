// Reference: https://docs.google.com/document/d/1yGg5DUbqOrw1aCA5u1s2VCRL_dFu6LQOvbDLamgl9bM/edit#
const Joi = require('@hapi/joi');

const idSchema = {
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .error((errors) => {
      return {
        message: 'Invalid ID',
      };
    }),
};

const subTaskId = Joi.object().keys({
  subTaskId: idSchema.id.required(),
});

const schema = {
  firstName: Joi.string()
    .trim()
    .lowercase()
    .min(2)
    .max(32)
    .regex(/^[a-z ,.'-]+$/i),
  lastName: Joi.string()
    .required()
    .lowercase()
    .min(2)
    .max(32)
    .regex(/^[a-z ,.'-]+$/i),
  email: Joi.string()
    .regex(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
    .lowercase()
    .min(3)
    .max(62),
  password: Joi.string().regex(
    /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/,
  ),
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
  pushSubscription: Joi.string().allow(null),
  subscriptionId: Joi.string().allow(null),
};
module.exports = {
  resendEmail: Joi.object().keys({
    body: Joi.object().keys({
      email: schema.email.required(),
    }),
  }),
  signup: Joi.object().keys({
    body: Joi.object().keys({
      email: schema.email.required(),
    }),
  }),
  getAccessTokenForVerifyAccount: Joi.object().keys({
    params: Joi.object().keys({
      token: Joi.string(),
    }),
  }),
  // register: Joi.object().keys({
  //   body: Joi.object().keys({
  //     firstName: schema.firstName.required(),
  //     lastName: schema.lastName,
  //     email: schema.email,
  //     password: schema.password.required(),
  //     isAccountVerified: schema.isAccountVerified,
  //     // contactNo: schema.contactNo,
  //     // .regex(/^(\+?(880)[0-9]{10})$/)
  //     // // .required()
  //     // .error((error) => {
  //     //   return {
  //     //     message: 'contactNo is not a valid format',
  //     //   };
  //     // }),
  //   }),
  // }),
  login: Joi.object().keys({
    body: Joi.object().keys({
      email: schema.email.required(),
      password: schema.password.required(),
      pushSubscription: schema.pushSubscription,
    }),
  }),
  init: Joi.object().keys({
    body: Joi.object().keys({
      firstName: schema.firstName.required(),
      lastName: schema.lastName.required(),
      password: schema.password.required(),
    }),
    query: Joi.object().keys({
      token: Joi.string().required(),
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
      firstName: schema.firstName,
      lastName: schema.lastName,
      password: schema.password.required(),
    }),
  }),
  resetPassword: Joi.object().keys({
    body: Joi.object().keys({
      password: schema.password.required(),
      token: Joi.string(),
    }),
  }),
  changePassword: Joi.object().keys({
    body: Joi.object().keys({
      oldPassword: schema.password.required(),
      newPassword: schema.password
        .disallow(Joi.ref('oldPassword'))
        .required(),
    }),
  }),

  logout: Joi.object().keys({
    body: Joi.object().keys({
      refreshToken: schema.refreshToken,
      subscriptionId: schema.subscriptionId,
    }),
  }),

  subTaskMarkAsDone: Joi.object().keys({
    body: Joi.object().keys({
      done: Joi.boolean(),
    }),
    params: subTaskId,
  }),
  updateEmail: Joi.object().keys({
    body: Joi.object().keys({
      id: idSchema.id.required(),
      email: schema.email.required(),
    }),
  }),
  changeEmail: Joi.object().keys({
    body: Joi.object().keys({
      previousEmail: schema.email.required(),
      newEmail: schema.email.required(),
    }),
  }),
};
