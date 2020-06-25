const {
  Subscription,
  SubscriptionHistory,
} = require('./subscription.model');

const Plan = require('../plan/plan.model');
const logger = require('../../config/winston.js');

const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');

const createSubscriptionForCompany = async (req, res, next) => {
  try {
    const { companyId, plan } = req.body;
    const planValidation = await Plan.findById({ _id: plan }).select(
      'validity',
    );
    const subscription = new Subscription({
      company: companyId,
      plan: plan,
      isActive: true,
      expireAt:
        new Date().getTime() + 86400000 * planValidation.validity,
    });
    await subscription.save();
    logger.info(`Subscription created for ${companyId}`);
    await SubscriptionHistory.create({
      subscription: subscription._id,
      plan: plan,
    });
    logger.info(`Subscription History created for ${companyId}`);
    return sendJSONresponse(res, 201, {
      message: `New Subscription created`,
      subscription: subscription._id,
    });
  } catch (error) {
    logger.error(`Subscription: ${error}`);
    next(error);
  }
};

const currentSubscriptionPlan = async (req, res, next) => {
  try {
    await Subscription.findOne({
      company: req.params.companyId,
      isActive: true,
    })

      .populate('plan', 'name maxTier pricing')
      .exec()
      .then((result) => {
        return sendJSONresponse(res, 200, result);
      });
  } catch (error) {
    logger.error(`Subscription: ${error}`);
    next(error);
  }
};

const changeSubscriptionPlan = async (req, res, next) => {
  await Subscription.findOneAndUpdate(
    { company: req.params.companyId },
    {
      $set: {
        plan: req.body.plan,
      },
    },
    { safe: true, upsert: true, new: true },
  )
    .exec()
    .then(() => {
      logger.info(
        `Subscription plan changed for ${req.params.companyId}`,
      );
      return sendJSONresponse(res, 200, {
        message: `Subscription plan changed for ${req.params.companyId}`,
      });
    })
    .catch((error) => {
      logger.error(`Subscription: ${error}`);
      next(error);
    });
};

const renewSubscription = async (req, res, next) => {
  try {
    let extendDate = req.subscribe;
    await Subscription.updateOne(
      { company: req.params.companyId, isActive: true },
      { $set: { expireAt: extendDate } },
      { upsert: true, new: true },
    );
    return sendJSONresponse(res, 200, {
      message: 'Subscription extended',
    });
  } catch (error) {
    logger.error(`Subscription: ${error}`);
    next(error);
  }
};
const subscriptionExpireCheck = () => {
  return async (req, res, next) => {
    try {
      const subscribe = await Subscription.findOne({
        company: req.params.companyId,
        isActive: true,
      });
      if (!subscribe) {
        return sendErrorResponse(res, 404, 'CompanyIdNotFoundError', {
          message: `companyId not found`,
        });
      }
      let today = new Date().getTime();

      if (subscribe.expireAt > today) {
        req.subscribe = subscribe.expireAt;
        next();
      } else {
        return sendErrorResponse(
          res,
          403,
          'SubscriptionExpirationError',
          { message: 'Your subscription is expired' },
        );
      }
    } catch (error) {
      logger.error(`Subscription: ${error}`);
      next(error);
    }
  };
};
module.exports = {
  createSubscriptionForCompany,
  currentSubscriptionPlan,
  changeSubscriptionPlan,
  renewSubscription,
  subscriptionExpireCheck,
};
