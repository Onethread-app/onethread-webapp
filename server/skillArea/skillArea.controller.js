const SkillArea = require('./skillArea.model');
const Account = require('../account/account.model');
const httpStatus = require('http-status');
const logger = require('../../config/winston.js');
const { sendJSONresponse } = require('../helpers/jsonResponse');
const {
  APIError,
  EmailIdExistError,
  BadRequestError,
  SearchNotMatchError,
} = require('../helpers/APIError');

const createSkill = async (req, res) => {
  if (!req.is('application/json')) {
    logger.error("'Expects 'application/json'");
    return res.send("Expects 'application/json'");
  }
  const skill = req.body.name;
  const newSkill = new SkillArea();
  newSkill.name = skill;
  newSkill.accountId.push(req.user._id);
  newSkill
    .save()
    .then(skill => {
      const skillInfo = {};
      skillInfo._id = skill._id;
      skillInfo.name = skill.name;
      return sendJSONresponse(res, 201, {
        success: true,
        message: 'new skill created',
        skillInfo,
      });
    })
    .catch(err => {
      logger.error(` process:${process.pid} Bad request : ${err}`);
      return sendJSONresponse(res, 400, {
        success: false,
        message: 'could not create',
        reason: err,
      });
    });
};

const getSkillInfo = async (req, res) => {
  console.log(req);
  const skill = req.params.id;
  console.log(skill);
  SkillArea.findOne({ _id: skill })
    .populate('accountId')
    .exec()
    .then(result => {
      if (result) {
        console.log(result);

        return sendJSONresponse(res, 200, {
          success: true,
          msg: 'Skillset get',
          skillArea: result,
        });
      } else {
        return sendJSONresponse(res, 404, {
          success: false,
          msg: '404 not found',
        });
      }
    })
    .catch(err => {
      logger.error(`error : ${err}`);
      return sendJSONresponse(res, 400, {
        success: false,
        error: err,
      });
    });
};

const getAllSkill = async (req, res) => {
  const { limit = 50, skip = 0 } = req.query;
  SkillArea.find({})

    .skip(+skip)
    .limit(+limit)
    .then(results => {
      if (results) {
        return sendJSONresponse(res, 200, {
          success: true,
          SkillArea: results,
        });
      } else {
        res.status(404).json({ message: 'No Basic-info found' });
      }
    })
    .catch(err => {
      next(err);
    });
};

const updateSkillInfo = async (req, res) => {
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  SkillArea.findOneAndUpdate({ _id: req.params.skill })
    .exec()
    .then(result => {
      if (result) {
        return sendJSONresponse(res, 201, {
          success: true,
          message: 'Successfully update',
          skillArea: result,
        });
      } else {
        logger.error('404 document not found');
        return sendJSONresponse(res, 404, {
          success: false,
          message: 'Document not found',
        });
      }
    })
    .catch(err => {
      next(err);
    });
};

const skillLoad = async (req, res, next, id) => {
  SkillArea.findById(id)
    .exec()
    .then(result => {
      if (result) {
        req.skill = result;

        next();
      } else {
        return res.status(400).json({
          message: 'No valid entry found for provided ID',
        });
      }
    })
    .catch(err => {
      return next(err);
    });
};
const searchSkillSet = async (req, res, next) => {
  const name = req.query.name;
  if (name === '') {
    const err = new BadRequestError(
      'Nothing Submitted',
      httpStatus.BAD_REQUEST,
      true,
    );
    logger.error(`Query Error: ${err}`);
    return next(err);
  }
  SkillArea.find({ name: { $regex: new RegExp(name) } })
    .select('-accountId')
    .then(data => {
      if (data.length < 1) {
        const err = new SearchNotMatchError(
          'Query does not found',
          httpStatus.BAD_REQUEST,
          true,
        );
        logger.error(`Query Error: ${err}`);
        return next(err);
      } else {
        logger.info(`Search complete ${name}`);
        return sendJSONresponse(res, 200, {
          success: true,
          message: `Search complete for ${name}`,
          data,
        });
      }
    })
    .catch(err => {
      logger.error(`${err}`);
      return next(err);
    });
};

const updateUserSkillInfo = async (req, res, next) => {
  try {
    const skillId = req.body.skillArea;
    const userID = req.user._id;
    const user = await Account.updateOne(
      { _id: userID },
      { $addToSet: { skillArea: skillId } },
    );
    const userSkill = await Account.findOne({ _id: userID }).populate(
      'skillArea',
      'name',
    );
    const skillList = userSkill.skillArea;
    return sendJSONresponse(res, 200, { success: true, skillList });
  } catch (error) {
    return sendJSONresponse(res, 400, { error });
  }
};

const deleteSkillInfoFromAccount = async (req, res, next) => {
  try {
    const skillId = req.query.skillId;
    console.log(typeof skillId);
    const userId = req.user._id;
    console.log(userId, skillId);
    await Account.findOneAndUpdate(
      { _id: userId },
      { $pull: { skillArea: skillId } },
      {
        safe: true,
        upsert: true,
      },
    );
    const userInfo = await Account.findOne({ _id: userId }).populate(
      'skillArea',
      'name',
    );
    const skillArea = userInfo.skillArea;
    return sendJSONresponse(res, 200, { skillArea });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createSkill,
  getSkillInfo,
  getAllSkill,
  updateSkillInfo,
  deleteSkillInfoFromAccount,
  skillLoad,
  searchSkillSet,
  updateUserSkillInfo,
};
