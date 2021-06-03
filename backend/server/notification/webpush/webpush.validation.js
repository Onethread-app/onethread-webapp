const Joi = require('@hapi/joi');

exports.saveSubscription = (data) => {
  const schema = Joi.object().keys({
    account: Joi.string().required(),
    pushSubscription: Joi.string().required(),
  });
  return Joi.validate(data, schema);
};

exports.triggerNotification = (data) => {
  const schema = Joi.object().keys({
    announcementText: Joi.string().required(),
  });
  return Joi.validate(data, schema);
};
