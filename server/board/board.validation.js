const Joi = require('joi');

// id
const idSchema = {
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .error(errors => {
      return {
        message: 'Invalid ID',
      };
    }),
};

const schema = {
  name: Joi.string(),
  description: Joi.string(),
  company: idSchema.id,
  columns: Joi.array().items(idSchema.id),
  members: Joi.array().items(idSchema.id),
  removed: Joi.boolean()
}


module.exports = {
  createBoard: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      description: schema.description.allow(''),
      companyId: schema.company
    }),
  })
};
