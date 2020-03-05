const { Member } = require('../company/member/member.model');
const { Project } = require('./project.model');
const File = require('../file/file.model');
const logger = require('../../config/winston');
const {
  sendErrorResponse,
  sendJSONresponse,
} = require('../helpers/jsonResponse');

const createNewProjectForCompany = async (req, res, next) => {
  const userExist = await Member.findOne({
    account: req.body.concernedAdmin,
  });
  if (userExist) {
    const project = new Project({
      name: req.body.name,
      type: req.body.type,
      concernedAdmin: req.body.concernedAdmin,
      departments: req.body.departments,
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

const showAllProjectsForCompany = async (req, res, next) => {
  const { limit = 50, skip = 0, companyId } = req.query;
  const allProjects = await Project.find({
    company: companyId,
    removed: false,
  })
    .populate('departments', 'name _id')
    .select('-type -__v -associates -files -version ')
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

const updateProjectPreface = async (req, res, next) => {  
    const project = await Project.findOne({_id: req.params.pid});
    project.description = req.body.description;
    project.outline = req.body.outline;
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
};

const getProjectDetails = async (req, res, next) => {
  try {
    const project=await Project.findOne({
      _id: req.params.pid,
    }).select('outline description color name').populate('files', 'link');
    // console.log(req.project)
    return sendJSONresponse(res, 200, project);
  } catch (error) {
    console.log(error)
    next(error);
  }
};
// const getProjectLoad = async (req, res, next) => {
//   console.log('ami',req)
//   try {
//     Project.findOne({
//       _id: ObjectID("5e60cc3caa10921ba1d07c8a"),
//     });
//     // console.log(project)
//     if (project) {
//       req.project = project;
//       return next();
//     } else {
//       logger.error(`project id not found`);
//       return sendErrorResponse(res, 404, 'ProjectIdNotFoundError', {
//         message: 'Project id not found for company',
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

const changeTitleProject = async (req, res, next) => {
  await Project.findByIdAndUpdate(
    { _id: req.body.pid },
    { $set: { name: req.body.name } },
    { safe: true, upsert: true, new: true },
  )
    .exec()
    .then(result => {
      logger.info(`project name change successfully`);
      return sendJSONresponse(res, 200, {
        message: 'Project Name changed',
      });
    })
    .catch(err => {
      logger.error(`${err}`);
      next(err);
    });
};

const archiveProject = async (req, res, next) => {
  await Project.findByIdAndUpdate(
    { _id: req.params.pid },
    { $set: { removed: true } },
    { safe: true, upsert: true, new: true },
  )
    .exec()
    .then(result => {
      logger.info(`Archieve a project`);
      return sendJSONresponse(res, 200, {
        message: `Archieve a project`,
      });
    })
    .catch(err => {
      logger.error(`${err}`);
      next(err);
    });
};

const showAllFilesForProject = async (req, res, next) => {
  const { limit = 10, skip = 0 } = req.query;
  await File.find({ project: req.params.pid })
    .select('link s3Key')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(result => {
      logger.info(`get all files from project ${req.params.pid}`);
      return sendJSONresponse(res, 200, { success: true, result });
    })
    .catch(err => {
      logger.error(`${err}`);
      next(err);
    });
};

const suggestConcernAdmin = async (req, res, next) => {
  try {
    await Member.find({
      company: req.query.companyId,
    })
      .select('-_id account')
      .populate('account', '_id name firstName lastName email profileImage')
      .exec()
      .then(result => {
        return sendJSONresponse(res, 200, result);
      });
  } catch (error) {
    next(error);
  }
};
const archiveProjectList = async (req, res, next) => {
  await Project.find({ company: req.query.companyId, removed: true })
  .populate('departments', 'name _id')  
  .select('name members')
    .exec()
    .then(result => {
      return sendJSONresponse(res, 200, result);
    })
    .catch(err => {
      next(err);
    });
};
module.exports = {
  createNewProjectForCompany,
  showAllProjectsForCompany,
  updateProjectPreface,
  // getProjectLoad,
  getProjectDetails,
  changeTitleProject,
  archiveProject,
  showAllFilesForProject,
  suggestConcernAdmin,
  archiveProjectList,
};
