const httpStatus = require('http-status');
const { Member } = require('../company/member/member.model');
const { Project } = require('./project.model');
const logger = require('../../config/winston');
const {
  sendErrorResponse,
  sendJSONresponse,
} = require('../helpers/jsonResponse');

const createNewProject = async (req, res, next) => {
  const userExist = await Member.findOne({
    account: req.body.concernedAdmin,
  });
  if (userExist) {
    const project = new Project({
      name: req.body.name,
      type: req.body.type,
      concernedAdmin: req.body.concernedAdmin,
      department: [req.body.departments],
      color: req.body.color,
      company: req.body.companyId,
    });
    await project
      .save()
      .then(project => {
        logger.info(`new project created`);
        return sendJSONresponse(res, 201, {
          sucees: true,
          message: 'New project created',
          project,
        });
      })
      .catch(error => {
        logger.error(`${error}`);
        next(error);
      });
  } else {
    return sendErrorResponse(res, 404, 'MemberNotFoundError', {
      message: 'concernAdmin not added in company',
    });
  }
};

const listProjectsFromCompany = async (req, res, next) => {
  const { limit = 50, skip = 0, companyId } = req.query;
  const allProjects = await Project.find({
    company: companyId,
  })
    .select('name color departments')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(result => {
      logger.info(`all projects for company:${companyId}`);
      return sendJSONresponse(res, 200, result);
    })
    .catch(e => next(e));
};

const prefaceUpdate = async (req, res, next) => {
  await Project.findByIdAndUpdate(
    { _id: req.params.pid },
    {
      $set: {
        outline: req.body.outline,
        description: req.body.description,
      },
    },
    { safe: true, upsert: true, new: true },
  )
    .exec()
    .then(result => {
      logger.info(`preface addeed for ${req.body.pid}`);
      return sendJSONresponse(res, 200, {
        success: true,
        message: 'Preface updated',
      });
    })
    .cactch(err => {
      logger.error(`${err}`);
      next(err);
    });
};

const getProjectDetails = async (req, res, next) => {
  try {
    let project = await Project.findOne({
      _id: req.params.pid,
    });
    return sendJSONresponse(res, 200, project);
  } catch (error) {
    next(error);
  }
};
const getProjectLoad = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      name: req.params.pid,
    });

    if (project) {
      req.project = project;
      return next();
    } else {
      logger.error(`project id not found`);
      return sendErrorResponse(res, 404, 'ProjectIdNotFoundError', {
        message: 'Project id not found for company',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewProject,
  listProjectsFromCompany,
  prefaceUpdate,
  getProjectLoad,
  getProjectDetails,
};
