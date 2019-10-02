const SkillArea = require('./skillArea.model');
const logger = require('../../config/winston.js');
const { sendJSONresponse } = require('../helpers/jsonResponse');

const createSkill = async (req, res) => {
  if (!req.is('application/json')) {
    logger.error("'Expects 'application/json'");
    return res.send("Expects 'application/json'");
  }
  const skill = req.body.skill;
  const newSkill = new SkillArea();
  newSkill.skill = skill;
  newSkill
    .save()
    .then(skill => {
      logger.info('new skill created');
      console.log(skill.tag);
      return sendJSONresponse(res, 201, {
        success: true,
        message: 'new skill created',
        skill,
      });
    })
    .catch(err => {
      logger.error(`Bad request : ${err}`);
      return sendJSONresponse(res, 400, {
        sucess: false,
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
    .populate('accountid')
    .exec()
    .then(result => {
      if (result) {
        return sendJSONresponse(res, 200, {
          sucess: true,
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
      res.status(500).json({ error: err });
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
      res.status(500).json({ error: err });
    });
};

const deleteSkillInfo = async (req, res) => {
  SkillArea.findByIdAndRemove({ _id: req.params.skill })
    .exec()
    .then(result => {
      if (result) {
        return sendJSONresponse(res, 201, {
          success: true,
          message: 'Successfully deleted',
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
      res.status(500).json({ error: err });
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
module.exports = {
  createSkill,
  getSkillInfo,
  getAllSkill,
  updateSkillInfo,
  deleteSkillInfo,
  skillLoad,
};
