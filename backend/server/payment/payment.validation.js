const Joi = require('@hapi/joi');

const idSchema = {
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
};



const companyId = Joi.object().keys({
  companyId: idSchema.id.required(),
});

const schema = {
    
  subscription: idSchema.id,
  gateway: Joi.string(),
  company: idSchema.id,
  reference: Joi.string(),
<<<<<<< HEAD
  statusPg: Joi.string(),
=======
>>>>>>> 3a98ae02... Wip/tig 229 (#232)
  currency: Joi.string(),
  amount: Joi.number(),
};

module.exports = {
  create: Joi.object().keys({
    body: Joi.object().keys({
      subscription: schema.subscription,
      gateway: schema.gateway.required(),
      company: schema.company,
      reference: schema.reference.required(),
<<<<<<< HEAD
      statusPg: schema.statusPg,
=======
>>>>>>> 3a98ae02... Wip/tig 229 (#232)
      currency: schema.currency.required(),
      amount: schema.amount.required(),
    }),
    params: companyId,
  }),
  intent: Joi.object().keys({
    body: Joi.object().keys({
      amount: schema.amount.required(),
    }),
    
  }),
};
