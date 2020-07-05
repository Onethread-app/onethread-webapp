const Account = require('../account/account.model');
const logger = require('../../config/winston');
// const { pusherChannel } = require('../services/pusher.services');
const { sendJSONresponse } = require('../helpers/jsonResponse');
const { VideoConference } = require('./videoConference.model');

// const getJoinee = async (req, res, next) => {
//   try {
//     const userInfo = await Account.findOne({
//       _id: req.user._id,
//     })
//       .select('-password')
//       .populate('skillArea', '_id name');

//     pusherChannel.trigger('joinee', 'joined', {
//       message: 'test messgae',
//     });

//     return sendJSONresponse(res, 200, {
//       success: true,
//       user: userInfo,
//     });
//   } catch (error) {
//     logger.error(`${error}`);
//     next(error);
//   }
// };

const createVideoConferencRecord = async (req, res, next) => {
  try {
    const newRecord = new VideoConference({
      link: req.body.link,
      room: req.body.name,
      account: req.user._id,
    });

    const account = await Account.findOne({
      _id: req.user._id,
    });

    const record = await newRecord.save();

    return sendJSONresponse(res, 200, {
      success: true,
      record: record,
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
      records: records,
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
