const Joi = require('joi');

module.exports = {
  createSave: {
    body: {
      postRef: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    }
  }
};
