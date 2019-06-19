'use strict';
const Joi = require("joi");

module.exports = {
  createSave: {
    body: {
      text: Joi.string().required(),
      postRef: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    }
  }
};
