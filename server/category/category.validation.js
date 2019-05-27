const Joi = require("joi");

module.exports = {
  // category validation
  newCategory: {
    body: {
      name: Joi.string().required()
    }
  },
  newSubCategory: {
    body: {
      name: Joi.string().required()
    },
    params: {
      cid: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
    }
  },
  newSubSubCategory: {
    body: {
      name: Joi.string().required()
    },
    params: {
      sid: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
    }
  }
};
