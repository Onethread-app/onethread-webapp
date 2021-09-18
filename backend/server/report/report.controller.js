const { Report } = require('./report.model');
const { sendJSONresponse } = require('../helpers/jsonResponse');
const logger = require('../../config/winston.js');

const reportPost = async (req, res, next) => {
  try {
    const report = new Report({
      issueType: req.body.issueType,
      title: req.body.title,
      issueDetails: req.body.issueDetails,
      imageUrl: req.body.imageUrl,
      account: req.user._id,
    });
    await report.save();
    return sendJSONresponse(res, 201, {
      message: 'Report Received',
    });
  } catch (error) {
    logger.error(`report: ${error}`);
    next(error);
  }
};

module.exports = {
  reportPost,
};
