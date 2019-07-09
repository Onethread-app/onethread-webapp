const Joi = require("joi");

module.exports = {
<<<<<<< HEAD
  // POST /register
  // console.log('here');

  register: {
    body: {
      email: Joi.string()
        .email()
        .lowercase()
        .required(),
      password: Joi.string()
        .min(8)
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
=======

>>>>>>> 7da9b12151907919ecd25125bd4170c4742780c2

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
