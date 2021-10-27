const Joi = require('@hapi/joi');

// id
const idSchema = {
  id: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
};

// company-name
const companyId = Joi.object().keys({
  companyId: idSchema.id,
});

const schema = {
  name: Joi.string().max(50),
  pid: idSchema.id,
  memberId: idSchema.id,
  description: Joi.string().max(2500).allow(''),
  outline: Joi.string().max(5000).allow(''),
  budget: Joi.number().min(0),
  departments: Joi.array().items(idSchema.id),
  concernedAdmin: idSchema.id,
  deadline: Joi.date(),
  color: Joi.number(),
  company: idSchema.id,
  size: Joi.number().required(),
  associate: idSchema.id,
  associates: Joi.array().items(
    Joi.object().keys({
      _id: idSchema.id.required(),
      size: Joi.number().required(),
    }),
  ),
};

const accountId = Joi.object().keys({
  accountId: idSchema.id.required(),
});

module.exports = {
  createNewProjectForCompany: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      // concernedAdmin: Joi.object().keys({
      //   memberId: schema.memberId.required(),
      //   accountId: idSchema.id,
      // }),
      companyId: schema.company,
      departments: schema.departments,
      deadline: schema.deadline,
      color: schema.color,
      associates: schema.associates,
    }),
  }),
  createProjectFromHome: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      companyId: schema.company.required(),
      deadline: schema.deadline,
      color: schema.color,
      budget: schema.budget,
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
    params: schema.pid.required(),
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
      associate: schema.associate.required(),
    }),
  }),
  rejectProject: Joi.object().keys({
    params: companyId.required(),
    query: Joi.object().keys({
      pid: schema.pid.required(),
    }),
  }),
  updateProject: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      color: schema.color,
      deadline: schema.deadline,
      budget: schema.budget,
    }),
    query: Joi.object().keys({
      pid: schema.pid.required(),
    }),
  }),
  showProjectList: Joi.object().keys({
    params: companyId.required(),
  }),
  archiveProject: Joi.object().keys({
    query: Joi.object().keys({
      pid: schema.pid.required(),
    }),
  }),
  unarchiveProject: Joi.object().keys({
    query: Joi.object().keys({
      pid: schema.pid.required(),
    }),
  }),
  searchConcernAdmin: Joi.object().keys({
    params: companyId.required(),
  }),
  searchAssociateCompany: Joi.object().keys({
    params: companyId.required(),
    query: Joi.object().keys({
      companyName: schema.name.required(),
      name: schema.name.required(),
    }),
  }),
  getTasks: Joi.object().keys({
    query: Joi.object().keys({
      pid: schema.pid.required(),
    }),
  }),
  deleteTeamMember: Joi.object().keys({
    params: accountId,
  }),
  favouriteProject: Joi.object().keys({
    body: Joi.object().keys({
      memberId: schema.memberId.required(),
      isFavourite: Joi.boolean().required(),
    }),
    query: Joi.object().keys({
      pid: schema.pid.required(),
    }),
  }),
};
