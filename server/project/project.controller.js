const httpStatus = require('http-status');
const { Member } = require('../company/member/member.model');
const { Project } = require('./project.model');
const logger = require('../../config/winston');
const { APIError, BadRequestError } = require('../helpers/APIError');
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
      logger.info(`${result}`);
      return sendJSONresponse(res, 200, result);
    })
    .catch(e => next(e));
};
module.exports = { createNewProject, listProjectsFromCompany };
