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
  type: Joi.string(),
  departments: Joi.array().items(idSchema.id),
  concernedAdmin: idSchema.id,
  color: Joi.number(),
  company: idSchema.id,
  associates: Joi.array().items(idSchema.id),
}


module.exports = {
  createProject: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      type: schema.type.required(),
      concernedAdmin: schema.type.required(),
      companyId: schema.company.required(),
      departments: schema.departments.required(),
      color : schema.color
    }),
  })
};
