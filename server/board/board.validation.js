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
  department: idSchema.id,
  color: Joi.number(),
  company: idSchema.id,
  columns: Joi.array().items(idSchema.id),
  members: Joi.array().items(idSchema.id),
  removed: Joi.boolean()
}


module.exports = {
  createBoard: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      department: schema.department,
      companyId: schema.company ,
      color : schema.color
    }),
  })
};
