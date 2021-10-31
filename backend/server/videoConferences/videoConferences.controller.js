const Account = require('../account/account.model');

const logger = require('../../config/winston');

// const { pusherChannel } = require('../services/pusher.services');
const { sendJSONresponse } = require('../helpers/jsonResponse');

const { VideoConference } = require('./videoConference.model');

const createVideoConferencRecord = async (req, res, next) => {
  try {
    const newRecord = new VideoConference({
      link: req.body.link,
      room: req.body.name,
      account: req.user._id,
    });

    await Account.findOne({
      _id: req.user._id,
    });

    const record = await newRecord.save();

    return sendJSONresponse(res, 200, {
      success: true,
      record,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

const getAllRecordsForVideoConference = async (req, res, next) => {
  try {
    const records = await VideoConference.find({
      account: req.user._id,
    });

    return sendJSONresponse(res, 200, {
      success: true,
      records,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

module.exports = {
  // getJoinee,
  createVideoConferencRecord,
  getAllRecordsForVideoConference,
};
