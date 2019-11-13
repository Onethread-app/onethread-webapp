const logger = require('../../config/winston');
const config = require('../../config/config');
const { sendJSONresponse } = require('../helpers/jsonResponse');

module.exports.researcherAccess = async (req, res, next) => {
  try {
    if (req.member.role === 'superAdmin') {
      logger.info('_______________________');
      logger.info(`superAdmin Data: ${req.member}`);
      logger.info('_______________________');
      logger.info('OKAY !!! Authorized !!!');
      next();
    } else {
      return sendJSONresponse(res, 403, {
        success: false,
        message: 'No access permission. You are not superAdmin',
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.adminAccess = async (req, res, next) => {
  try {
    if (req.member.role === 'admin') {
      logger.info('_______________________');
      logger.info(req.member);
      logger.info('_______________________');
      logger.info('OKAY !!! Authorized !!!');
      next();
    } else {
      return sendJSONresponse(res, 403, {
        success: false,
        message: 'No access permission. You are not Admin',
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.managerAccess = async (req, res, next) => {
  try {
    if (req.member.role === 'manager') {
      logger.info('_______________________');
      logger.info(req.member);
      logger.info('_______________________');
      logger.info('OKAY !!! Authorized !!!');
      next();
    } else {
      return sendJSONresponse(res, 403, {
        success: false,
        message: 'No access permission. You are not manager',
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.moderatorAccess = async (req, res, next) => {
  try {
    if (req.member.role == 'moderator') {
      logger.info('_______________________');
      logger.info(req.member);
      logger.info('_______________________');
      logger.info('OKAY !!! Authorized !!!');
      next();
    } else {
      return sendJSONresponse(res, 403, {
        success: false,
        message: 'No access permission. You are not moderator',
      });
    }
  } catch (error) {
    next(error);
  }
};
module.exports.employeeAccess = async (req, res, next) => {
  try {
    if (req.member.role == 'employee') {
      logger.info('_______________________');
      logger.info(req.member);
      logger.info('_______________________');
      logger.info('OKAY !!! Authorized !!!');
      next();
    } else {
      return sendJSONresponse(res, 403, {
        success: false,
        message: 'No access permission. You are not employee',
      });
    }
  } catch (error) {
    next(error);
  }
};
