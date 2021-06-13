const logger = require('../../config/winston');
const Feedback = require('./feedback.model');

const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');

const create = async (req, res, next) => {
  try {
    const { bug, improve, usefulFeature, wishFeature, rating } =
      req.body;
    const feedback = new Feedback({
      bug,
      improve,
      usefulFeature,
      wishFeature,
      rating,
      account: req.user._id,
    });

    await feedback.save();

    return sendJSONresponse(res, 201, {
      message: 'Feedback Received',
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

module.exports = { create };
