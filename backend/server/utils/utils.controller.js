const logger = require(`../../config/winston`);
const Account = require('../account/account.model');
const { sendJSONresponse } = require('../helpers/jsonResponse');

const EmailIDExist = async (req, res, next) => {
  try {
    const emailId = req.body.email;
    const user = await Account.findOne({ email: emailId });
    if (user) {
      logger.info(`Email is not unique ${emailId}`);
      return sendJSONresponse(res, 409, {
        message: `Email is not unique`,
      });
    } else {
      logger.info(`Email is unique`);
      return sendJSONresponse(res, 200, {
        message: `Email is unique`,
      });
    }
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

const changeUserName = async (req, res, next) => {
  try {
    const name = req.query.name;
    const username = await Account.findOne({ name: name });
    if (username) {
      return sendJSONresponse(res, 409, {
        message: `username already exist`,
      });
    } else {
      await Account.updateOne({ _id: id }, { name: name })
        .select('-password')
        .exec()
        .then((user) => {
          return sendJSONresponse(res, 200, {
            success: true,
            message: 'Username Changed',
          });
        });
    }
  } catch (error) {
    logger.error(`${error}`)
    next(error);
  }
};
module.exports = { EmailIDExist, changeUserName };
