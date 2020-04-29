const Joi = require('@hapi/joi');
//const {Joi} = require('express-validation');





// id
const idSchema = {
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .error((errors) => {
      return {
        message: 'Invalid ID',
      };
    }),
};

const schema = {
  id: idSchema.id,
  text: Joi.string(),
  number: Joi.number(),
};

module.exports = {
  createSave: Joi.object().keys({
    body: Joi.object().keys({
      accountRef: schema.id.required(),
      account: schema.id.required(),
      text: schema.text.required(),
      rating: schema.number.required(),
    }),
  }),
};


