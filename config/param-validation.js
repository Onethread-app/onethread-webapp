const Joi = require("joi");

module.exports = {
  // POST /register
  // console.log('here');
  register: {
    body: {
      name: Joi.string()
        .regex(/^[A-Z]+ [A-Z]+$/i)
        .required(),
      email: Joi.string()
        .email()
        .lowercase()
        .required(),
      gender: Joi.string()
        .valid(["m", "f"])
        .required(),
      password: Joi.string()
        .min(8)
        .required(),
      skillArea: Joi.string().required(),
      mobileNumber: Joi.string()
        .regex(/^\+?(880)?1[3456789][0-9]{8}$/)
        .required()
    }
  },
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string()
        .regex(/^[1-9][0-9]{9}$/)
        .required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string()
        .regex(/^[1-9][0-9]{9}$/)
        .required()
    },
    params: {
      userId: Joi.string()
        .hex()
        .required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
