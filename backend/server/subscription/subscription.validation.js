const Joi = require('@hapi/joi');

const idSchema = {
  id: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
};

const schema = {
  companyId: idSchema.id.required(),
  plan: idSchema.id.required(),
  isActive: Joi.boolean,
  expireAt: Joi.date(),
  subId: idSchema.id,
};

module.exports = {
  createSubscription: Joi.object().keys({
    body: Joi.object().keys({
      companyId: schema.companyId,
      plan: schema.plan,
    }),
  }),
  getSubscriptionPlan: Joi.object().keys({
    params: schema.companyId,
  }),
  currentSubscriptionPlan: Joi.object().keys({
    params: Joi.object().keys({
      companyId: schema.companyId,
    }),
  }),
  changeSubscriptionPlan: Joi.object().keys({
    params: Joi.object().keys({
      companyId: schema.companyId,
    }),
    body: Joi.object().keys({
      plan: schema.plan,
    }),
  }),
  renewSub: Joi.object().keys({
    params: Joi.object().keys({
      companyId: schema.companyId,
    }),
    // body: Joi.object().keys({
    //   subId: schema.subId,
    // }),
  }),
};
