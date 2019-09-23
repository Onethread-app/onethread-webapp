const Joi = require('joi');

module.exports = {
  createSave: {
    body: {
      accountRef: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
      text: Joi.string(),
      rating: Joi
        .number()
        .max(5)
        .min(1),
      account: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    }
  }
};
