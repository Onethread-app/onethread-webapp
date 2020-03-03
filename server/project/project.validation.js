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

// project id
const pid = Joi.object().keys({
  pid: idSchema.id,
});
const schema = {
  name: Joi.string().max(50).alphanum(),
  type: Joi.string(),
  pid: idSchema.id,
  description: Joi.string().max(2500),
  outline: Joi.string().max(5000),
  departments: Joi.array().items(idSchema.id),
  concernedAdmin: idSchema.id,
  color: Joi.number(),
  company: idSchema.id,
  associates: Joi.array().items(idSchema.id),
};

module.exports = {
  createNewProjectForCompany: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      type: schema.type.required(),
      concernedAdmin: schema.type.required(),
      companyId: schema.company.required(),
      departments: schema.departments.required(),
      color: schema.color,
    }),
  }),
  updateProjectPreface: Joi.object().keys({
    body: Joi.object().keys({
      pid: schema.pid,
      description: schema.description,
      outline: schema.outline,
    }),
  }),
  getProject: Joi.object().keys({
    params: pid.required(),
  }),
  changeTitleProject: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      pid: schema.pid.required(),
    })
  }),
  showProjectList: Joi.object().keys({
    query: Joi.object().keys({
      companyId: schema.company.required(),
    })
  })
};
