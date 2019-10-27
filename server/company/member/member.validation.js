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
  account: idSchema.id,
  company: idSchema.id,
  department: idSchema.id,
  division: idSchema.id,
  position: Joi.string(),
  role: Joi.string().valid([
    'Super Admin',
    'Admin',
    'Manager',
    'Moderator',
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
  // updateCompany: Joi.object().keys({
  //   body: Joi.object().keys({
  //     address: schema.address.required(),
  //     email: schema.email,
  //     legalOwnerName: schema.legalOwnerName,
  //     legalOwnerMail: schema.legalOwnerMail,
  //     about: schema.about,
  //   }),
  //   params: cname,
  // }),
  // deleteCompany: Joi.object().keys({
  //   params: cname,
  // }),
};
