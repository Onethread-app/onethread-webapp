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
      description: '',
      outline: '',
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

const updateProjectDescription = async (req, res, next) => {
  await Project.findByIdAndUpdate(
    { _id: req.params.pid },
    {
      $set: {
        description: req.body.description,
      },
    },
    { safe: true, upsert: true, new: true },
  )
    .exec()
    .then(result => {
      logger.info(`Description addeed for ${req.parms.pid}`);
      return sendJSONresponse(res, 200, {
        success: true,
        message: 'Description updated',
      });
    })
    .catch(err => {
      logger.error(`${err}`);
      next(err);
    });
};

const updateProjectOutline = async(req, res, next) =>{
  await Project.findByIdAndUpdate(
    { _id: req.params.pid },
    {
      $set: {
        outline: req.body.outline,
      },
    },
    { safe: true, upsert: true, new: true },
  )
    .exec()
    .then(result => {
      logger.info(`Outline addeed for ${req.params.pid}`);
      return sendJSONresponse(res, 200, {
        success: true,
        message: 'Outline updated',
      });
    })
    .catch(err => {
      logger.error(`${err}`);
      next(err);
    });
}

const getProjectDetails = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.pid,
    })
    .populate('files', 'link s3Key')
      .select('outline description color name');
    // console.log(req.project)
    return sendJSONresponse(res, 200, project);
  } catch (error) {
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
  try {
    const projectExist = await Project.findOne({
      _id: req.params.pid,
      removed: false,
    });
    if (projectExist) {
      await Project.updateOne(
        { _id: req.params.pid },
        { $set: { removed: true } },
        { safe: true, upsert: true, new: true },
      );
      logger.info(`Archive a project  ${req.params.pid}`);
      return sendJSONresponse(res, 200, {
        message: `Archive a project`,
      });
    } else {
      logger.error(`project id not found`);
      return sendErrorResponse(res, 404, 'ProjectIdNotFoundError', {
        message: 'Project id not found for company',
      });
    }
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
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
      .populate(
        'account',
        '_id name firstName lastName email profileImage',
      )
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

const searchMemberFromMyCompany = async(req, res, next) =>{
  try {
    const name = req.query.name;
    const companyID = req.company._id;
    const company = await Company.findById({
      _id: companyID,
    }).populate('members', 'account');
    let memberListId = company.members;
    memberListId = memberListId.map(member => member.account);
    let data = await Account.find({
      $and: [
        { name: { $regex: new RegExp(name) } },
        { _id: { $nin: memberListId } },
      ],
    }).select('_id email name firstName lastName');
    // TODO: pore ami change korbo query onusaree
    return sendJSONresponse(res, 200, {
      projectMember: {
        message: `Search complete ${name}`,
        data,
      },
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }

}

const searchMemberFromAssociates = async()=>{

};

const addTeamMember = async(req, res, next) =>{
  if (!req.is('application/json')) {
    return sendErrorResponse(res, 406, 'ContentTypeError', {message:"Expects 'application/json'"})
  }

  try {
    const members = await Member.create(req.body.members);
    if (!members.length) {
      return res.status(400).json({
        message: `No members created`,
      });
    }

    let membersId = members.map(m => {
      return m._id;
    });

    let accountsId = req.body.members.map(m => {
      return m.account;
    });

    // save ref in company
    req.company.members.addToSet(...membersId);
    await req.company.save();

    // add members into General room
    const room = await Room.findOne({
      name: 'General',
      company: req.company._id,
    });
    if (room) {
      room.members.addToSet(...accountsId);
      await room.save();
      await chatkit.addUsersToRoom({
        roomId: room._id,
        userIds: accountsId,
      });
    }

    return res.status(201).json({
      message: 'New member created',
      members,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }

}
module.exports = {
  createNewProjectForCompany,
  showAllProjectsForCompany,
  updateProjectDescription,
  updateProjectOutline,
  // getProjectLoad,
  getProjectDetails,
  changeTitleProject,
  archiveProject,
  showAllFilesForProject,
  suggestConcernAdmin,
  archiveProjectList,
  addTeamMember,
};
