const Joi = require('joi');

// id
const id = Joi.object().keys({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .error(errors => {
      return {
        message: 'Invalid ID',
      };
    }),
});

// company-name
const cname = Joi.object().keys({
  cname: Joi.string().required(),
});

// joi schema
const schema = {
  name: Joi.string().max(32),
  type: Joi.string().valid([
    'associates',
    'Department',
    'internal-project',
  ]),
  label: Joi.number().integer(),
  description: Joi.string().max(2000),
  outline: Joi.string().max(2000),
  files: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  company: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .error(errors => {
      return {
        message: 'Invalid Company ID',
      };
    }),
};

module.exports = {
  create: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      type: schema.type.required(),
      label: schema.label.required(),
    }),
  }),
};
