const Joi = require('@hapi/joi');

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

// joi schema
const schema = {
  account: idSchema.id,
  company: idSchema.id,
  department: idSchema.id,
  division: idSchema.id,
  pid: idSchema.id,
  position: Joi.string(),
  role: Joi.string().valid([
    'superAdmin',
    'admin',
    'manager',
    'moderator',
    'employee',
  ]),
};

// memberId
const memberId = Joi.object().keys({
  memberId: idSchema.id.required(),
});

module.exports = {
  newMember: Joi.object().keys({
    body: Joi.object().keys({
      account: schema.account.required(),
      department: schema.department.required(),
      division: schema.division.required(),
      position: schema.position.required(),
    }),
  }),
  getMember: Joi.object().keys({
    params: memberId,
  }),
  changeRole: Joi.object().keys({
    body: Joi.object().keys({
      role: Joi.string().valid([
        'admin',
        'projectModerator',
        'member',
      ]),
    }),
    params: memberId,
  }),
  inviteTeam: Joi.object().keys({
    headers: Joi.object().keys({
      companyid: schema.company,
    }),
    query: Joi.object().keys({
      pid: schema.pid,
    }),
    body: Joi.array()
      .min(1)
      .max(200)
      .items(
        Joi.string()
          .regex(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          )
          .lowercase()
          .min(3)
          .max(62)
          .required()
          .error(() => {
            return {
              message: 'Invalid email format',
            };
          }),
      ),
  }),
};
