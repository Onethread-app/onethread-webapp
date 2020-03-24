const Joi = require('joi');

// id
const idSchema = {
  id: Joi.string()
    .regex(/^[a-fA-F0-9]{24}$/)
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
// company-name
const companyId = Joi.object().keys({
  companyId: idSchema.id,
});

const schema = {
  name: Joi.string().max(50),
  type: Joi.string(),
  pid: idSchema.id,
  memberId: idSchema.id,
  description: Joi.string()
    .max(2500)
    .allow(''),
  outline: Joi.string()
    .max(5000)
    .allow(''),
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
  updateProjectOutline: Joi.object().keys({
    body: Joi.object().keys({
      outline: schema.outline,
    }),
  }),
  updateProjectDescription: Joi.object().keys({
    body: Joi.object().keys({
      description: schema.description,
    }),
  }),
  getProject: Joi.object().keys({
    params: pid.required(),
  }),
  changeNameProject: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
    }),
    query: Joi.object().keys({
      pid: schema.pid.required(),
      memberId: schema.memberId.required(),
    }),
  }),
  showProjectList: Joi.object().keys({
    params: companyId.required(),
  }),
  archiveProject: Joi.object().keys({
    params: pid.required(),
  }),
  searchConcernAdmin: Joi.object().keys({
    params: companyId.required(),
  }),
};
