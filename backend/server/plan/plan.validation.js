const Joi = require('@hapi/joi');

const idSchema = {
  id: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
};

// Plan Id
const planId = Joi.object().keys({
  planId: idSchema.id,
});

const schema = {
  name: Joi.string().valid([
    'trial',
    'small',
    'medium',
    'enterprise',
  ]),
  maxTier: Joi.number(),
  description: Joi.string().max(2500).allow(''),
  pricing: Joi.number(),
  planId: planId.required(),
};

module.exports = {
  createPlan: Joi.object().keys({
    body: Joi.object().keys({
      name: schema.name.required(),
      maxTier: schema.maxTier.required(),
      description: schema.description,
      pricing: schema.pricing.required(),
    }),
  }),
  getSinglePlan: Joi.object().keys({
    params: planId,
  }),
  updatePlan: Joi.object().keys({
    params: planId,
    body: Joi.object().keys({
      name: schema.name,
      maxTier: schema.maxTier,
      description: schema.description,
      pricing: schema.pricing,
    }),
  }),
  planName: Joi.object().keys({
    query: Joi.object().keys({
      name: schema.name.required(),
    }),
  }),
};
