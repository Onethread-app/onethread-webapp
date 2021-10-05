const _ = require('lodash');

const logger = require('../../config/winston');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');
const { Company } = require('../company/company.model');
const { Member } = require('../company/member/member.model');
const { Team } = require('../team-member/team.model');
const { Project } = require('../project/project.model');
const { Room } = require('../room/room.model');
const Subtask = require('../task/subtask/subtask.model');
const Account = require('../account/account.model');
const Notification = require('./notification.model');
const ObjectId = require('mongoose').Types.ObjectId;
const UserNotification = require('./userNotification.model');
const {
  findTaskById,
  findTaskMembersById,
} = require('../services/task/task.service');
const {
  createNotification,
  createNotificationForUser,
} = require('../services/notification/notification.service');
const {
  findAccountById,
} = require('../services/account/account.service');
const { findBoardById } = require('../services/board/board.service');
const {
  findColumnById,
} = require('../services/boardColumn/boardColumn.service');
const {
  teamMemberListFindByProjectId,
} = require('../services/teams/teams.services');
const {
  triggerUnreadNotifications,
} = require('../services/webpush.services');
const {
  sendCompanyRoleNotification,
  sendNotification,
} = require('../services/notification.services');

const notificationBuilder = (
  type,
  text,
  account,
  company,
  column,
  project,
  task,
  board,
  fromColumn,
  toColumn,
) => {
  return {
    type: type,
    text: text,
    account: account,
    company: company,
    fromColum: column,
    project: project,
    task: task,
    board: board,
    fromColumn: fromColumn,
    toColumn: toColumn,
  };
};

const userNotificationBuilder = (notiId, account) => {
  return {
    notification: notiId,
    account: account,
  };
};
module.exports.createCompanyRoleNotification = async (
  company,
  adminUser,
  text,
  type,
) => {
  //sendCompanyNotification(company, adminUser, usersNotification);
  try {
    let members = await Member.find({
      $or: [{ role: 'superAdmin' }, { role: 'admin' }],
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
module.exports.notifyToBoardMembers = async (
  senderName,
  company,
  taskId,
  adminUser,
  sourceColumnId,
  destinationColumnId,
) => {
  try {
    const senderFullName = await findAccountById(senderName);
    const task = await findTaskById(taskId);
    // TODO: notify to task member instead of board member
    let boardMember = await findBoardById(task.boardId);
    const sourceColumnName = await findColumnById(sourceColumnId);
    const destName = await findColumnById(destinationColumnId);
    let notification = notificationBuilder(
      'subtask',
      `${_.upperFirst(senderFullName.firstName)} ${_.upperFirst(
        senderFullName.lastName,
      )} moved task ${task.name} from ${sourceColumnName.name} to ${
        destName.name
      }`,
      adminUser._id,
      company,
      task.project,
      taskId,
      task.boardId,
      sourceColumnId,
      destinationColumnId,
    );
    boardMember.members.forEach(async (account) => {
      if (account.toString() !== senderName) {
        notification = await createNotification(notification);
        notification = await notification
          .populate('company', 'uniqueName _id')
          .execPopulate();
        let userNotification = await createNotificationForUser(
          userNotificationBuilder(notification._id, account),
        );
        userNotification = {
          ...userNotification._doc,
          notification,
        };
        sendNotification(
          account._id,
          userNotification,
          adminUser.pusherSock,
        );
        await triggerUnreadNotifications(account._id);
      }
    });
  } catch (error) {
    logger.error(`Notifications: ${error}`);
  }
};
module.exports.notifyToTaskMember = async (
  senderName,
  company,
  taskId,
  adminUser,
  member,
) => {
  try {
    const account = await findAccountById(senderName);
    let task = await findTaskById(taskId);
    let notificationList = await createNotification(
      notificationBuilder(
        'subtask',
        `${_.upperFirst(account.firstName)} ${_.upperFirst(
          account.lastName,
        )} sent a note in task ${task.name} `,
        adminUser._id,
        company,
        task.project,
        taskId,
        task.boardId,
      ),
    );
    notificationList = await notificationList
      .populate('company', 'uniqueName _id')
      .execPopulate();
    let userNotification = await createNotificationForUser(
      userNotificationBuilder(notificationList._id, member),
    );
    userNotification = {
      ...userNotification._doc,
      notificationList,
    };
    sendNotification(member, userNotification, adminUser.pusherSock);
    await triggerUnreadNotifications(account._id);
  } catch (error) {
    logger.error(`Notifications: ${error}`);
  }
};

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
    let uName = await findAccountById(senderName);
    let teamMembers = await teamMemberListFindByProjectId(pid);
    const board = await findBoardById(boardId);
    let notification = await createNotification(
      notificationBuilder(
        'board',
        `${_.upperFirst(uName.firstName)} ${_.upperFirst(
          uName.lastName,
        )} created a task in board ${board.name} `,
        adminUser._id,
        company,
        columnId,
        pid,
        taskId,
        boardId,
      ),
    );
    teamMembers = teamMembers.map((m) => {
      return { account: m.member.account };
    });
    teamMembers.forEach(async (member) => {
      if (member.account._id.toString() !== adminUser._id) {
        let userNotification = await createNotificationForUser(
          userNotificationBuilder(notification._id, member.account),
        );
        userNotification = {
          ...userNotification._doc,
          notification,
        };
        console.log(member);
        sendNotification(
          member.account._id,
          userNotification,
          adminUser.pusherSock,
        );
        await triggerUnreadNotifications(member.account._id);
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
    let senderFullName = await findAccountById(senderName);
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
    const account = await findAccountById(senderName);
    const taskAssign = await findTaskMembersById(taskId);
    let notification = await createNotification(
      notificationBuilder(
        'task',
        `${_.upperFirst(account.firstName)} ${_.upperFirst(
          account.lastName,
        )} added you in task ${taskAssign.taskId.name} `,
        adminUser._id,
        companyId,
        taskAssign.taskId.columnId._id,
        taskAssign.taskId.project._id,
        taskAssign.taskId._id,
        taskAssign.taskId.boardId._id,
      ),
    );
    let userNotification = await createNotificationForUser(
      userNotificationBuilder(notification._id, reciever),
    );

    userNotification = {
      ...userNotification._doc,
      notification,
    };
    sendNotification(
      account._id,
      userNotification,
      adminUser.pusherSock,
    );
    await triggerUnreadNotifications(account._id);
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
    let senderFullName = await findAccountById(senderName);
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
    //TODOs: duplicate code
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
  const { limit = 50, skip = 0 } = req.query;

  try {
    let unseenCount = await UserNotification.find({
      account: req.user._id,
      seen: false,
      read: false,
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
    { account: req.user._id },
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

module.exports.read = async (req, res, next) => {
  await UserNotification.findByIdAndUpdate(
    {
      _id: req.params.userNotificationId,
      account: req.user._id,
    }, //notUserNotification
    { $set: { read: true } },
    { upsert: true, new: true },
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

module.exports.markAllAsRead = async (req, res, next) => {
  try {
    await UserNotification.updateMany(
      { _id: { $in: req.body.list } },
      { $set: { read: true } },
      { upsert: true, new: true },
    ).exec();
    const modifiedNotifications = await UserNotification.find({
      _id: { $in: req.body.list },
    }).exec();
    return sendJSONresponse(res, 200, modifiedNotifications);
  } catch (error) {
    logger.info('Notification', error);
    next(error);
  }
};
