const Plan = require('./plan.model');
const logger = require('../../config/winston.js');

const { sendJSONresponse } = require('../helpers/jsonResponse');

const allPlanList = async (req, res, next) => {
  try {
    const { skip = 0, limit = 50 } = req.query;
    await Plan.find({})
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec()
      .then((result) => {
        return sendJSONresponse(res, 200, result);
      })
      .catch((error) => {
        logger.error(`Plan: ${error}`);
        next(error);
      });
  } catch (error) {
    logger.error(`Plan: ${error}`);
    next(error);
  }
};

const findPlanIdForCompany = async (req, res, next) => {
  try {
    await Plan.findOne({ name: req.query.name })
      .exec()
      .then((result) => {
        return sendJSONresponse(res, 200, result);
      })
      .catch((error) => {
        logger.error(`Plan: ${error}`);
        next(error);
      });
  } catch (error) {
    logger.error(`Plan: ${error}`);
    next(error);
  }
};
module.exports = {
  allPlanList,
  findPlanIdForCompany,
};
