const { Company } = require('../company/company.model');
const { Member } = require('../company/member/member.model');
const { Team } = require('../team-member/team.model');
const { Project } = require('../project/project.model');
const { Room } = require('../room/room.model');
const Board = require('../board/board.model');
const BoardColumn = require('../boardColumn/boardColumn.model');
const Task = require('../task/task.model');
const TaskAssign = require('../task/taskAssign.model');
const Subtask = require('../task/subtask/subtask.model');
const Account = require('../account/account.model');
const Notification = require('./notification.model');
const ObjectId = require('mongoose').Types.ObjectId;
const UserNotification = require('./userNotification.model');
const _ = require('lodash');
const {
  triggerUnreadNotifications,
} = require('../services/webpush.services');
const {
  sendCompanyRoleNotification,
  sendCompanyAndProjectNotification,
  sendCompanyNotification,
} = require('../services/notification.services');
const logger = require('../../config/winston');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');

const { adminFirebase } = require('./../services/firebase.services');

module.exports.userTokenFCM = async (req, res, next) => {
  let topic = `${req.body.company}-${req.body.role}`;
  adminFirebase
    .messaging()
    .subscribeToTopic(req.body.token, topic)
    .then(function (response) {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      //console.log('Successfully subscribed to topic:', response);
      return res.status(200).json({ message: 'success' });
    })
    .catch(function (error) {
      logger.error(`${error}`);
      next(error);
    });
};

module.exports.notifyToBoardMembers = async (
  senderName,
  company,
  taskId,
  adminUser,
  sourceColumnId,
  destinationColumnId
) => {
  try {
    let senderFullName = await Account.findById({
      _id: senderName,
    }).select('firstName lastName');
    let task = await Task.findById({_id: taskId}).select('name boardId project');
    let boardMember = await Board.findOne({_id: task.boardId, project: task.project}).select('members');
    let sourceColumnName = await BoardColumn.findOne({_id: sourceColumnId}).select('name');
    let destName = await BoardColumn.findOne({_id: destinationColumnId}).select('name');
    let notifications = {
      type: 'subtask',
      text: `${_.upperFirst(senderFullName.firstName)} ${_.upperFirst(
        senderFullName.lastName,
      )} move task ${task.name} from ${sourceColumnName.name} to ${destName.name}`,
      account: adminUser._id,
      company: company,
      project: task.project,
      task: taskId,
      board: task.boardId,
      fromColumn: sourceColumnId,
      toColumn: destinationColumnId,
    };
    boardMember.members.forEach(async e=>{
      if(e.toString() !== senderName){
        notifications = await Notification.create(notifications);
        await UserNotification.create({
          notification: notifications._id,
          account: e,
        });
        await triggerUnreadNotifications(e);
      }
    });
  } catch (error) {
    logger.error(`Notifications: ${error}`);
  }
}
module.exports.notifyToTaskMember = async (
  senderName,
  company,
  taskId,
  adminUser,
  member
) =>{
  try {
    let senderFullName = await Account.findById({
      _id: senderName,
    }).select('firstName lastName');
    let task = await Task.findById({_id: taskId}).select('name').select('boardId project');
    let notifications = {
      type: 'subtask',
      text: `${_.upperFirst(senderFullName.firstName)} ${_.upperFirst(
        senderFullName.lastName,
      )} sent a note in task ${task.name} `,
      account: adminUser._id,
      company: company,
      project: task.project,
      task: taskId,
      board: task.boardId
    };
    
    notifications = await Notification.create(notifications);
    await UserNotification.create({
      notification: notifications._id,
      account: member,
    });
    await triggerUnreadNotifications(member);
  } catch (error) {
    console.log(error)
    logger.error(`Notifications: ${error}`);
  }
}

module.exports.sendNotificationToProjectTeamMates = async (
  senderName,
  company,
  pid,
  taskId,
  columnId,
  boardId,
  adminUser,
) => {
  try {
    let senderFullName = await Account.findById({
      _id: senderName,
    }).select('firstName lastName');
    let teamMembers = await Team.find({
      project: pid,
    })
      .select('member')
      .populate('member', '_id account');
    const board = await Board.findById({ _id: boardId }).select(
      'name',
    );
    let notifications = {
      type: 'board',
      text: `${_.upperFirst(senderFullName.firstName)} ${_.upperFirst(
        senderFullName.lastName,
      )} created a task in board ${board.name} `,
      account: adminUser._id,
      company: company,
      fromColum: columnId,
      project: pid,
      task: taskId,
      board: boardId,
    };
    notifications = await Notification.create(notifications);
    teamMembers = teamMembers.map((m) => {
      return { account: m.member.account };
    });
    teamMembers.forEach(async (member) => {
      if (member.account.toString() !== adminUser._id) {
        let userNoti = await UserNotification.create({
          notification: notifications._id,
          account: member.account,
        });
        await triggerUnreadNotifications(member.account);
      }
    });
  } catch (error) {
    logger.error(`Notifications: ${error}`);
  }
};

module.exports.createMemberAddNotification = async (
  company, //fromHeader
  senderName,
  newMembers,
  adminUser,
) => {
  try {
    let senderFullName = await Account.findById({
      _id: senderName,
    }).select('firstName lastName');
    let companyName = await Company.findById({ _id: company }).select(
      'name',
    );
    let notifications = newMembers.map((m) => {
      return {
        type: 'colleague',
        text: `${_.upperFirst(
          senderFullName.firstName,
        )} ${_.upperFirst(
          senderFullName.lastName,
        )} added you in company ${companyName.name} `,
        account: adminUser._id,
        company: company,
      };
    });
    notifications = await Notification.create(notifications);
    newMembers = newMembers.map((m) => {
      return { account: m.account._id };
    });
    newMembers.forEach(async (member) => {
      notifications = notifications.map(async (m) => {
        let userNoti = await UserNotification.create({
          notification: m._id,
          account: member.account,
        });
      });
    });
  } catch (error) {
    logger.error(`Notifications: ${error}`);
    //next(error);
  }
};

module.exports.createTeamAddNotification = async (
  senderName,
  companyId,
  projectName,
  newMembers,
  adminUser,
) => {
  try {
    let senderFullName = await Account.findById({
      _id: senderName,
    }).select('firstName lastName');
    let project = await Project.findById({ _id: projectName }).select(
      'name',
    );
    let notifications = {
      type: 'team',
      text: `${_.upperFirst(senderFullName.firstName)} ${_.upperFirst(
        senderFullName.lastName,
      )} added you in project ${project.name} `,
      account: adminUser._id,
      project: project._id,
      company: companyId,
    };
    notifications = await Notification.create(notifications);
    await UserNotification.create({
      notification: notifications._id,
      account: newMembers,
    });
  } catch (error) {
    logger.error(`Notification: ${error}`);
    //next(error);
  }
};

module.exports.taskAssignNotificationToUsers = async (
  senderName,
  companyId,
  taskId,
  reciever,
  adminUser,
) => {
  try {
    let senderFullName = await Account.findById({
      _id: senderName,
    }).select('firstName lastName');
    // let project = await Project.findById({_id: projectName}).select('name');
    const options = [
      {
        path: 'taskId',
        select: '_id name boardId columnId project',
        populate: [
          {
            path: 'project',
            select: '_id',
          },
          {
            path: 'boardId',
            select: '_id',
          },
          {
            path: 'columnId',
            select: '_id',
          },
        ],
      },
      {
        path: 'account',
        select: '_id firstName lastName',
      },
    ];

    let taskAssign = await TaskAssign.findById({
      _id: taskId,
    }).populate(options);
    let notifications = {
      type: 'task',
      text: `${_.upperFirst(senderFullName.firstName)} ${_.upperFirst(
        senderFullName.lastName,
      )} added you in task ${taskAssign.taskId.name} `,
      account: adminUser._id,
      project: taskAssign.taskId.project._id,
      company: companyId,
      task: taskAssign.taskId._id,
      fromColumn: taskAssign.taskId.columnId._id,
      board: taskAssign.taskId.boardId._id,
    };
    notifications = await Notification.create(notifications);
    await UserNotification.create({
      notification: notifications._id,
      account: reciever,
    });
  } catch (error) {
    logger.error(`Notification: ${error}`);
  }
};

module.exports.subTaskAssignNotificationToUsers = async (
  senderName,
  companyId,
  subTaskId,
  reciever,
  adminUser,
) => {
  try {
    const options = [
      {
        path: 'taskId',
        select: '_id name boardId columnId project',
        populate: [
          {
            path: 'project',
            select: '_id company',
          },
          {
            path: 'boardId',
            select: '_id',
          },
          {
            path: 'columnId',
            select: '_id',
          },
        ],
      },
      {
        path: 'account',
        select: '_id firstName lastName',
      },
    ];
    //TODOS: don't need account find query in future
    let senderFullName = await Account.findById({
      _id: senderName,
    }).select('firstName lastName');
    let subTaskAssign = await Subtask.findById({
      _id: subTaskId,
    }).populate(options);
    // console.log('sub', subTaskAssign);
    let notifications = {
      type: 'subtask',
      text: `${_.upperFirst(senderFullName.firstName)} ${_.upperFirst(
        senderFullName.lastName,
      )} added you in subtask ${subTaskAssign.taskId.name} `,
      account: adminUser._id,
      project: subTaskAssign.taskId.project,
      company: companyId,
      task: subTaskAssign.taskId._id,
      subtask: subTaskAssign._id,
      fromColumn: subTaskAssign.taskId.columnId,
      board: subTaskAssign.taskId.boardId,
    };
    // console.log(notifications);
    notifications = await Notification.create(notifications);
    await UserNotification.create({
      notification: notifications._id,
      account: reciever,
    });
  } catch (error) {
    logger.error(`Notification: ${error}`);
  }
};
// module.exports.createAssociateNotification = async (
//   company,
//   adminUser,
//   text,
// ) => {
//   //sendCompanyNotification(company, adminUser, usersNotification);

//   const members = await Member.find({
//     $or: [{ role: 'superAdmin' }, { role: 'admin' }],
//     company: company,
//   });

//   let notification = new Notification({
//     type: 'associate',
//     text: text,
//     account: adminUser._id,
//     company: company,
//   });

//   let usersNotification = members.map(m => {
//     return {
//       notification: notification._id,
//       account: m.account,
//     };
//   });

//   const companyRoleReciver = ['superAdmin', 'admin'];
//   sendCompanyRoleNotification(
//     company._id,
//     companyRoleReciver,
//     adminUser,
//     notification,
//   );

//   await notification.save();
//   await UserNotification.create(usersNotification);
// };

module.exports.createCompanyNotification = async (
  company,
  adminUser,
  text,
  type,
) => {
  //sendCompanyNotification(company, adminUser, usersNotification);
  try {
    let members = await Member.find({
      company: company,
    });

    members = members.filter(
      (m) => m.account.toString() !== adminUser._id.toString(),
    );
    let notification = {};
    if (type === 'task') {
      notification = new Notification({
        type: type,
        text: text,
        account: adminUser._id,
        company: company._id,
        task: company.task,
        board: company.board,
        project: company.project,
      });
    } else {
      notification = new Notification({
        type: type,
        text: text,
        account: adminUser._id,
        company: company,
      });
    }

    let usersNotification = members.map((m) => {
      return {
        notification: notification._id,
        account: m.account,
      };
    });

    let companyRoleReciver = ['superAdmin', 'admin'];
    sendCompanyRoleNotification(
      company._id,
      companyRoleReciver,
      adminUser,
      notification,
    );

    await notification.save();
    await UserNotification.create(usersNotification);
  } catch (error) {
    logger.error(`${error}`);
  }
};

module.exports.createBoardNotification = async (
  board,
  adminUser,
  text,
) => {
  //sendCompanyNotification(company, adminUser, usersNotification);
  try {
    const members = await Member.find({
      $or: [{ role: 'superAdmin' }, { role: 'admin' }],
      company: board.company,
    });

    const teamMembers = await Team.find({
      $or: [{ role: 'projectModerator' }, { role: 'admin' }],
      project: board.project,
    });

    let notification = new Notification({
      type: 'board',
      text: text,
      account: adminUser._id,
      project: board.project,
      board: board._id,
      company: board.company,
    });

    let usersAccountNotificationCollegue = members.map((m) => {
      return m.account.toString();
    });

    let usersAccountNotificationTeam = teamMembers.map((m) => {
      return m.account.toString();
    });

    let allNotificationReciver = _.union(
      usersAccountNotificationCollegue,
      usersAccountNotificationTeam,
    );
    allNotificationReciver = allNotificationReciver.filter(
      (m) => m !== adminUser._id.toString(),
    );

    let usersNotificationAll = allNotificationReciver.map((m) => {
      return {
        notification: notification._id,
        account: m,
      };
    });

    // let usersNotificationTeam = teamMembers.map(m => {
    //   return {
    //     notification: notification._id,
    //     account: m.account,
    //   };
    // });

    //project role wise notification incomplete

    let companyRoleReciver = ['superAdmin', 'admin'];
    let companyEvent = board.company; //

    let projectRoleReciver = ['modarator'];
    // let projectEvent =  project._id; //

    sendCompanyAndProjectNotification(
      { company: board.company, _id: board.project },
      companyRoleReciver,
      projectRoleReciver,
      adminUser,
      notification,
    );

    await notification.save();
    await UserNotification.create(usersNotificationAll);
  } catch (error) {
    logger.error(`Board notification: ${error}`);

    //next(error);
  }
};

module.exports.addTeamMateIntoRoomNotification = async (
  company, //fromHeader
  senderName,
  newMembers,
  adminUser,
  roomId,
  pid,
) => {
  try {
    let senderFullName = await Account.findById({
      _id: senderName,
    }).select('firstName lastName');
    let roomName = await Room.findById({ _id: roomId }).select(
      'name',
    );
    let notifications = newMembers.map((m) => {
      return {
        type: 'room',
        text: `${_.upperFirst(
          senderFullName.firstName,
        )} ${_.upperFirst(
          senderFullName.lastName,
        )} added you in Room ${roomName.name} `,
        account: adminUser._id,
        company: company,
        room: roomId,
        project: pid,
      };
    });
    notifications = await Notification.create(notifications);
    newMembers = newMembers.map((m) => {
      return { account: m.account };
    });
    newMembers.forEach(async (member) => {
      notifications = notifications.map(async (m) => {
        let userNoti = await UserNotification.create({
          notification: m._id,
          account: member.account,
        });
        await triggerUnreadNotifications(member.account);
      });
    });
  } catch (error) {
    logger.error(`Notifications: ${error}`);
    //next(error);
  }
};
module.exports.list = async (req, res, next) => {
  const { limit = 50, skip = 0} = req.query;

  try {
    let unseenCount = await UserNotification.find({
      account: req.user._id,
      seen: false,
      read: false
    }).countDocuments();

    const options = [
      {
        path: 'notification',
        select:
          '_id type text account company project board room task subTask fromColum toColum registerUser associate createdAt',
        populate: [
          {
            path: 'company',
            select: 'uniqueName',
          },
        ],
      },
    ];
    let notificationFound = await UserNotification.find({
      account: req.user._id,
    })
      .populate(options)
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  
    console.log(notificationFound[0]);
    return sendJSONresponse(res, 200, {
      result: notificationFound,
      unseenCount: unseenCount,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

module.exports.seen = async (req, res, next) => {
  await UserNotification.updateMany(
    { account: req.user._id},
    { $set: { seen: true } },
  )
    .exec()
    .then((result) => {
      logger.info(`${result}`);
      return sendJSONresponse(res, 200, result);
    })
    .catch((e) => {
      logger.error(`${e}`);
      next(e);
    });
};

module.exports.test = async (req, res, next) => {
  //  UserNotification.aggregate()
  //   //.project('notification')
  //   .match({'account' : new ObjectId(req.user._id)})
  //   //.unwind('notification')
  //   //.unwind('$notification.company')
  //   //.match({'notification.company' : new ObjectId(req.params.companyId)})
  //   .exec()
  //   .then(result => {
  //     console.log(result);
  //     logger.info(`${result}`);
  //     return sendJSONresponse(res, 200, result);
  //   });
  let count = await UserNotification.aggregate([
    { $match: { account: new ObjectId(req.user._id) } },

    {
      $lookup: {
        from: 'notifications',
        localField: 'notification',
        foreignField: '_id',
        as: 'notification',
      },
    },
    {
      $unwind: {
        path: '$notification',
      },
    },
    {
      $match: {
        'notification.company': new ObjectId(req.params.companyId),
      },
    },
    { $group: { _id: '$read', count: { $sum: 1 } } },
  ]);

  let resultCompany = await UserNotification.aggregate([
    { $match: { account: new ObjectId(req.user._id) } },

    {
      $lookup: {
        from: 'notifications',
        localField: 'notification',
        foreignField: '_id',
        as: 'notification',
      },
    },
    {
      $unwind: {
        path: '$notification',
      },
    },
    {
      $match: {
        'notification.company': new ObjectId(req.params.companyId),
      },
    },
    // {'$group':{'_id': '$read', 'count':{'$sum':1},"docs": { "$push": "$$ROOT" }} },
    //{ "$unwind": "$docs" },

    { $limit: 5 },
    { $skip: 0 },
  ]);

  return sendJSONresponse(res, 200, {
    result: resultCompany,
    unreadCount: count[1].count,
  });
};

module.exports.read = async (req, res, next) => {
  console.log(req.params.userNotificationId);
  await UserNotification.findByIdAndUpdate(
    {
      _id: req.params.userNotificationId,
      account: req.user._id,
    }, //notUserNotification
    { $set: { read: true } },
    {upsert: true, new: true}
  )
    .exec()
    .then((result) => {
      logger.info(`${result}`);
      return sendJSONresponse(res, 200, { read: true });
    })
    .catch((e) => {
      logger.log(`Notification: ${e}`);
      next(e);
    });
};
