'use strict';

const Joi = require('joi');

module.exports = {
  createSave: {
    body: {
      companyRef: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
      name: Joi.string(),
    },
  },
};
