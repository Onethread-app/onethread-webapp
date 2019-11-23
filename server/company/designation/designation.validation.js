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

// joi schema
const schema = {
  member: idSchema.id,
  division: Joi.string().valid([
    'director',
    'cxo',
    'seniorManager',
    'middleManager',
    'operationalEmployee',
  ]),
  department: idSchema.id,
  position: Joi.string(),
};

// memberId
const memberId = Joi.object().keys({
  memberId: idSchema.id.required(),
});

module.exports = {
  create: Joi.object().keys({
    body: Joi.object().keys({
      division: schema.division.required(),
      department: schema.department,
      position: schema.position.required(),
    }),
    params: memberId,
  }),
  get: Joi.object().keys({
    params: memberId,
  }),
};
