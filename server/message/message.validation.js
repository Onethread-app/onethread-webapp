'use strict';

const Joi = require('joi');

module.exports = {
  createMessage: {
    body: {
      text: Joi.string(),
      room: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    }
    
  }
};