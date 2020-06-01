const SkillArea = require('./skillArea.model');
const { AccountSkill } = require('./accountSkill.model');
const Account = require('../account/account.model');
const logger = require('../../config/winston.js');
const chalk = require('chalk');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');

// all services
const {
  setDocument,
  skillIndex,
  search,
} = require('../services/elastic.services');
const { addSkillIntoCache } = require('../services/redis.services');

const createSkill = async (req, res, next) => {
  if (!req.is('application/json')) {
    return res.send("Expects 'application/json'");
  }

  const skill = req.body.name;
  // const skillExist = await SkillArea.findOne({ name: skill });
  // if (skillExist) {
  //   return sendJSONresponse(res, 200);
  // }
  const newSkill = new SkillArea();
  newSkill.name = skill;
  newSkill.account.push(req.user._id);
  newSkill
    .save()
    .then(async (skill) => {
      const skillInfo = {};
      skillInfo._id = skill._id;
      skillInfo.name = skill.name;
      await setDocument(skillIndex, '_doc', {
        mongo_id: skillInfo._id,
        name: skillInfo.name,
        account: skillInfo.accountId,
      });
      return sendJSONresponse(res, 201, {
        success: true,
        message: 'new skill created',
        skillInfo,
      });
    })
    .catch((err) => {
      logger.error(`${err}`);
      next(err);
    });
};

// const createSkill = async (req, res, next) => {
//   if (!req.is('application/json')) {
//     return sendErrorResponse(res, 406, 'ContentTypeError', {
//       message: "Expects 'application/json'",
//     });
//   }
//   const skill = req.body.name;
//   const newSkill = new SkillArea({
//     name: skill,
//     account: req.user.id,
//   });
//   newSkill
//     .save()
//     .then(async skill => {
//       const skillInfo = {};
//       const userSkill = AccountSkill.create({
//         account: req.user._id,
//         skillArea: skill._id,
//       });
//       await setDocument(skillIndex, '_doc', {
//         mongo_id: skillInfo._id,
//         name: skillInfo.name,
//         account: skillInfo.accountId,
//       });

//       return sendJSONresponse(res, 201, {
//         success: true,
//         message: 'new skill created',
//         userSkill,
//       });
//       // logger.info(
//       //   chalk.blueBright(
//       //     `ElasticSearch successfully added document  on ${skillIndex}`,
//       //   ),
//       // );
//     })
//     .catch(err => {
//       logger.error(`${err}`);
//       next(err);
//     });
// };

const getSkillInfo = async (req, res) => {
  const skill = req.params.id;

  SkillArea.findOne({ _id: skill })
    .populate('accountId')
    .exec()
    .then((result) => {
      if (result) {
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
    .catch((err) => {
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
    .then((results) => {
      if (results) {
        return sendJSONresponse(res, 200, {
          success: true,
          SkillArea: results,
        });
      } else {
        res.status(404).json({ message: 'No Basic-info found' });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const updateSkillInfo = async (req, res) => {
  if (!req.is('application/json')) {
    return sendErrorResponse(res, 406, 'ContentTypeError', {
      message: "Expects 'application/json'",
    });
  }

  SkillArea.findOneAndUpdate({ _id: req.params.skill })
    .exec()
    .then((result) => {
      if (result) {
        return sendJSONresponse(res, 201, {
          success: true,
          message: 'Successfully update',
          result,
        });
      } else {
        logger.error('404 document not found');
        return sendJSONresponse(res, 404, {
          success: false,
          message: 'Document not found',
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const skillLoad = async (req, res, next, id) => {
  SkillArea.findById(id)
    .exec()
    .then((result) => {
      if (result) {
        req.skill = result;

        next();
      } else {
        return res.status(400).json({
          message: 'No valid entry found for provided ID',
        });
      }
    })
    .catch((err) => {
      return next(err);
    });
};

const searchSkillSet = async (req, res, next) => {
  try {
    const name = req.query.name;
    const userId = req.user._id;
    const userSkill = await Account.findOne({ _id: userId });
    const userskillId = userSkill.skillArea;
    // const
    if (name === '') {
      return sendErrorResponse(res, 200, {});
    }

    await SkillArea.find({
      $and: [
        { name: { $regex: new RegExp(name), $options: 'i' } },
        { _id: { $nin: userskillId } },
      ],
    })
      .select('-accountId')
      .then((data) => {
        logger.info(`Search complete ${name}`);
        return sendJSONresponse(res, 200, {
          success: true,
          message: `Search complete for ${name}`,
          data,
        });
      })
      .catch((err) => {
        logger.error(`${err}`);
        
        return next(err);
      });
    // console.log(userSkill);
    // return sendJSONresponse(res, 200, { userSkill });
    // if (name) {
    //   let body = {
    //     size: 200,
    //     from: 0,
    //     query: {
    //       bool: {
    //         must: [
    //           {
    //             match: {
    //               name: req.query.name,
    //             },
    //           },
    //         ],
    //         must_not: [
    //           {
    //             terms: {
    //               mongo_id: userskill._id,
    //             },
    //           },
    //         ],
    //       },
    //     },
    //   };

    //   const result = await search(skillIndex, '_doc', body);

    //   return sendJSONresponse(res, 200, {
    //     success: true,
    //     message: `Search complete for ${name}`,
    //     data: result.hits.hits,
    //   });

    //   //   // await SkillArea.find({
    //   //   //   $and: [
    //   //   //     { name: { $regex: new RegExp(name), $options: 'i' } },
    //   //   //     { _id: { $nin: userskillId } },
    //   //   //   ],
    //   //   // })
    //   //   //   .select('-accountId')
    //   //   //   .then(data => {
    //   //   //     if (data.length < 1) {
    //   //   //       logger.error(`search not match for ${name}`);
    //   //   //       return sendErrorResponse(res, 404, 'SearchNotMatchError', {
    //   //   //         message: 'no skill found',
    //   //   //       });
    //   //   //     } else {
    //   //   //       logger.info(`Search complete ${name}`);
    //   //   //       return sendJSONresponse(res, 200, {
    //   //   //         success: true,
    //   //   //         message: `Search complete for ${name}`,
    //   //   //         data,
    //   //   //       });
    //   //   //     }
    //   //   //   })
    //   //   //   .catch(err => {
    //   //   //     logger.error(`${err}`);
    //   //   //     return next(err);
    //   //   //   });
    //   } else {
    //     return sendErrorResponse(res, 400, 'EmptySearchError', {
    //       message: `query error`,
    //     });
    //   }
    // }
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

const updateUserSkillInfo = async (req, res, next) => {
  try {
    const skillId = req.body.skillArea;
    const userID = req.user.email;
    const user = await Account.updateOne(
      { email: userID },
      { $addToSet: { skillArea: skillId } },
    );
    const userSkill = await Account.findOne({
      email: userID,
    }).populate('skillArea', '_id name');
    const skillList = userSkill.skillArea;
    return sendJSONresponse(res, 200, { skillList });
  } catch (error) {
    return sendJSONresponse(res, 400, { error });
  }
};
//   const skill = await AccountSkill.create(skillId);
//   console.log(skill);
//   let userSkill = await skill.populate('skillArea').execPopulate();
//   // const user = Account
//   //   let skillObj = {
//   //     skillArea: userSkill._id,
//   //     accountId: req.user._id,
//   //   };
//   // console.log(skilObj);
//   // const createSkill = await AccountSkill.create(skillObj);
//   // console.log(createSkill);
//   // addSkillIntoCache(req.user._id, skillObj);
//   return sendJSONresponse(res, 200, { userSkill });
// } catch (error) {
//   logger.error(`${error}`);
//   next(error);
// }
// };

const deleteSkillInfoFromAccount = async (req, res, next) => {
  try {
    const skillId = req.query.skillId;
    const userId = req.user._id;
    const user = await Account.findOneAndUpdate(
      { _id: userId },
      { $pull: { skillArea: skillId } },
      {
        safe: true,
        upsert: true,
        new: true,
      },
    ).populate('skillArea', 'name');
    const skillArea = user.skillArea;
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
