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
  company: idSchema.id,
  associateCompany: Joi.string(),
  removed: Joi.boolean()
}


module.exports = {
  createAssociate: Joi.object().keys({
        body: Joi.object().keys({
        companyId: schema.company.required() ,
        associateCompany: Joi.object().keys({
          _id: schema.company.required() ,
          name: schema.associateCompany.required() ,
      }),
    }),
  }),
};
