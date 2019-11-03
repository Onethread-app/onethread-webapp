'use strict';

const Joi = require('joi');

module.exports = {
  createRoom: {
    body: {
      name: Joi.string(),
      company: Joi.string()
    }
  }
};
