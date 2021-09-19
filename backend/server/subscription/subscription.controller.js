const { Subscription } = require('./subscription.model');

const Plan = require('../plan/plan.model');
const logger = require('../../config/winston.js');

const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');

const createSubscriptionForCompany = async (req, res, next) => {
  try {
    const companyId = req.headers.companyid;
    const { plan } = req.body;
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
    await Subscription.find({
      company: req.params.companyId,
      isActive: true,
    })
      .sort({ _id: -1 })
      .populate('plan', 'name maxTier pricing')
      .exec()
      .then((result) => {
        return sendJSONresponse(res, 200, result[0]);
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
      const validCompanyId =
        req.headers.companyid || req.body.companyId;

      if (!validCompanyId) {
        return sendErrorResponse(res, 400, 'ValidationError', {
          message: `companyId is required`,
        });
      }
      const subscribe = await Subscription.find({
        company: req.headers.companyid || req.body.companyId,
        isActive: true,
      }).sort({ _id: -1 });
      if (!subscribe) {
        return sendErrorResponse(res, 404, 'CompanyIdNotFoundError', {
          message: `companyId not found`,
        });
      }
      let today = new Date().getTime();
      if (subscribe[0].expireAt > today) {
        req.subscribe = subscribe[0].expireAt;
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
