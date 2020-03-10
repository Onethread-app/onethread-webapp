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
  company: idSchema.id,
  removed: Joi.boolean()
}


module.exports = {
  createAssociate: Joi.object().keys({
        body: Joi.object().keys({
        companyId: schema.company ,
        associateCompany: schema.company ,
    }),
  })
};
