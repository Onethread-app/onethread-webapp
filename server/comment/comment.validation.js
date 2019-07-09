'use strict';
const Joi = require("joi");

module.exports = {
  createSave: {
    body: {
      text: Joi.string().required(),
      respect: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).single(),
      like: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).single(),
      removed : Joi.bool(),
      postRef: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    }
  },
  updateSave: {
    body: {
      text: Joi.string().required()
    }
  }
};
