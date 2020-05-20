const Joi = require('@hapi/joi');

// id
const idSchema = {
  id: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
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
  pid: idSchema.id,
  memberId: idSchema.id,
  description: Joi.string().max(2500).allow(''),
  outline: Joi.string().max(5000).allow(''),
  departments: Joi.array().items(idSchema.id),
  concernedAdmin: idSchema.id,
  color: Joi.number(),
  company: idSchema.id,
<<<<<<< HEAD
<<<<<<< HEAD
  size: Joi.number().required(),
  associate: idSchema.id,
=======
>>>>>>> c885f026... add associates in the project (#19)
=======
  size: Joi.number().required(),
>>>>>>> e5e8ab62... Feature/role access (#187)
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
<<<<<<< HEAD
=======
      type: schema.type.required(),
>>>>>>> e5e8ab62... Feature/role access (#187)
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
<<<<<<< HEAD
  createProjectFromHome: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      companyId: schema.company.required(),
    }),
  }),
=======
>>>>>>> c885f026... add associates in the project (#19)
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
<<<<<<< HEAD
      associate: schema.associate.required(),
=======
>>>>>>> e5e8ab62... Feature/role access (#187)
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
<<<<<<< HEAD
      name: schema.name.required(),
=======
      name: schema.name.required()
>>>>>>> e5e8ab62... Feature/role access (#187)
    }),
  }),
};
