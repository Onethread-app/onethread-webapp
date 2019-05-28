const Joi = require("joi");

module.exports = {
  createSave: {
    body: {
      text: Joi.string().required(),
      refrence: Joi.string().regex(/^[0-9a-fA-F]{24}$/) //user comment or post query define that
    }
  }
};
