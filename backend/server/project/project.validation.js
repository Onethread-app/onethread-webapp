const Joi = require('@hapi/joi');

// id
const idSchema = {
  id: Joi.string()
    .regex(/^[a-fA-F0-9]{24}$/)
    .error((errors) => {
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
  description: Joi.string().max(2500).allow(''),
  outline: Joi.string().max(5000).allow(''),
  departments: Joi.array().items(idSchema.id),
  concernedAdmin: idSchema.id,
  color: Joi.number(),
  company: idSchema.id,
  size: Joi.number().required(),
  associates: Joi.array().items(
    Joi.object().keys({
      _id: idSchema.id.required(),
      size: Joi.number().required(),
    }),
  ),
};

module.exports = {
  createNewProjectForCompany: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      type: schema.type.required(),
      concernedAdmin: Joi.object().keys({
        memberId: schema.memberId.required(),
        accountId: idSchema.id,
      }),
      companyId: schema.company.required(),
      departments: schema.departments,
      color: schema.color,
      associates: schema.associates,
    }),
  }),
  addAssociate: Joi.object().keys({
    body: Joi.object().keys({
      associates: schema.associates,
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
  pendingList: Joi.object().keys({
    params: companyId.required(),
  }),
  acceptProject: Joi.object().keys({
    params: companyId.required(),
    query: Joi.object().keys({
      pid: schema.pid.required(),
    }),
    body: Joi.object().keys({
      size: schema.size.required(),
    }),
  }),
  rejectProject: Joi.object().keys({
    params: companyId.required(),
    query: Joi.object().keys({
      pid: schema.pid.required(),
    }),
  }),
  changeNameProject: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
    }),
    query: Joi.object().keys({
      pid: schema.pid.required(),
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
  searchAssociateCompany: Joi.object().keys({
    params: companyId.required(),
    query: Joi.object().keys({
      companyName: schema.name.required(),
      name: schema.name.required()
    }),
  }),
};
