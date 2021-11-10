const {
  Subscription,
} = require('../subscription/subscription.model');
const {
  findCompanyById,
} = require('../services/company/company.services');
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
      const isCompanyExist = await findCompanyById(validCompanyId);
      if (!isCompanyExist) {
        return sendErrorResponse(res, 404, 'NotFoundError', {
          message: `companyId does not exist`,
        });
      }
      const subscribe = await Subscription.find({
        company: req.headers.companyid || req.body.companyId,
        isActive: true,
      }).sort({ _id: -1 });
      if (!subscribe) {
        return sendErrorResponse(res, 404, 'NotFound', {
          message: `companyId not found`,
        });
      }
      let today = new Date().getTime();
      if (
        typeof subscribe === undefined ||
        typeof subscribe[0] === undefined ||
        typeof subscribe[0].expireAt === undefined ||
        subscribe[0].expireAt < today
      ) {
        return sendErrorResponse(
          res,
          403,
          'SubscriptionExpirationError',
          { message: 'Your subscription is expired' },
        );
      }
      req.subscribe = subscribe[0].expireAt;
      next();
    } catch (error) {
      logger.error(`Subscription: ${error}`);
      next(error);
    }
  };
};

module.exports = {
  subscriptionExpireCheck,
};
