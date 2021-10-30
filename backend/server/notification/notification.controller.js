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
const {
  findCompanyById,
  companyAdminSuperAdminList,
} = require('../services/company/company.services');

const notificationBuilder = (
  text,
  type,
  associate,
  project,
  room,
  board,
  task,
  subtask,
  company,
  fromColum,
  toColum,
  account,
) => {
  return {
    text: text,
    type: type,
    associate: associate,
    project: project,
    room: room,
    board: board,
    task: task,
    subtask: subtask,
    company: company,
    fromColum: fromColum,
    toColumn: toColum,
    account: account,
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
    let projectMembers = await teamMemberListFindByProjectId(
      task.project,
    );
    const sourceColumnName = await findColumnById(sourceColumnId);
    const destName = await findColumnById(destinationColumnId);
    let notification = notificationBuilder(
      `${_.upperFirst(senderFullName.firstName)} ${_.upperFirst(
        senderFullName.lastName,
      )} change the task ${task.name} status ${
        sourceColumnName.name
      } to ${destName.name}`,
      'subtask',
      null,
      task.project,
      null,
      null,
      taskId,
      null,
      company,
      sourceColumnId,
      destinationColumnId,
      adminUser._id,
    );
    projectMembers = projectMembers.map((m) => {
      return { account: m.member.account };
    });
    projectMembers.forEach(async (member) => {
      if (member.account._id.toString() !== senderName) {
        notification = await createNotification(notification);
        notification = await notification
          .populate('company', 'uniqueName _id')
          .execPopulate();
        let userNotification = await createNotificationForUser(
          userNotificationBuilder(
            notification._id,
            member.account._id,
          ),
        );
        userNotification = {
          ...userNotification._doc,
          notification,
        };
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
    let notification = await createNotification(
      notificationBuilder(
        `${_.upperFirst(account.firstName)} ${_.upperFirst(
          account.lastName,
        )} comment on task ${task.name} `,
        'task',
        null,
        task.project,
        null,
        task.boardId,
        taskId,
        null,
        company,
        null,
        null,
        adminUser._id,
      ),
    );
    notification = await notification
      .populate('company', 'uniqueName _id')
      .execPopulate();
    let userNotification = await createNotificationForUser(
      userNotificationBuilder(notification._id, member),
    );
    userNotification = {
      userNotification,
      notification,
    };
    sendNotification(member, userNotification, adminUser.pusherSock);
    await triggerUnreadNotifications(member);
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
    let projectMembers = await teamMemberListFindByProjectId(pid);
    const board = await findBoardById(boardId);
    let notification = await createNotification(
      notificationBuilder(
        `${_.upperFirst(uName.firstName)} ${_.upperFirst(
          uName.lastName,
        )} created a task in board ${board.name} `,
        'board',
        null,
        pid,
        null,
        boardId,
        taskId,
        null,
        company,
        columnId,
        null,
        adminUser._id,
      ),
    );
    projectMembers = projectMembers.map((m) => {
      return { account: m.member.account };
    });
    projectMembers.forEach(async (member) => {
      if (member.account._id.toString() !== adminUser._id) {
        let userNotification = await createNotificationForUser(
          userNotificationBuilder(notification._id, member.account),
        );
        userNotification = {
          ...userNotification._doc,
          notification,
        };
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
    let companyName = await findCompanyById(company);
    let notification = await createNotification(
      notificationBuilder(
        `${_.upperFirst(senderFullName.firstName)} ${_.upperFirst(
          senderFullName.lastName,
        )} added you in company ${companyName.name} `,
        'colleague',
        null,
        null,
        null,
        null,
        null,
        null,
        company,
        null,
        null,
        adminUser._id,
      ),
    );
    notification = await notification
      .populate('company', 'uniqueName _id')
      .execPopulate();
    newMembers = newMembers.map((m) => {
      return { account: m.account._id };
    });
    newMembers.forEach(async (member) => {
      let userNotification = await createNotificationForUser(
        userNotificationBuilder(notification._id, member.account._id),
      );
      userNotification = {
        ...userNotification._doc,
        notification,
      };
      sendNotification(
        member.account._id,
        userNotification,
        adminUser.pusherSock,
      );
      await triggerUnreadNotifications(member.account._id);
    });
  } catch (error) {
    logger.error(`Notifications: ${error}`);
    //next(error);
  }
};

module.exports.createPendingAssociateRequest = async (
  companyId,
  associateCompany,
  associateId,
  adminUser,
) => {
  try {
    const company = await findCompanyById(companyId);
    let associateAdminSuperAdminList =
      await companyAdminSuperAdminList(associateCompany);
    let notification = await createNotification(
      notificationBuilder(
        `${_.upperFirst(
          company.name,
        )} wants to add you as a partner.`,
        'associate',
        associateId,
        null,
        null,
        null,
        null,
        null,
        associateCompany,
        null,
        null,
        adminUser._id,
      ),
    );
    notification = await notification
      .populate({
        path: 'company',
        select: 'uniqueName _id',
      })
      .execPopulate();

    associateAdminSuperAdminList.forEach(async (member) => {
      let userNotification = await createNotificationForUser(
        userNotificationBuilder(notification._id, member.account._id),
      );
      userNotification = {
        ...userNotification._doc,
        notification,
      };
      sendNotification(
        member.account._id,
        userNotification,
        adminUser.pusherSock,
      );
      await triggerUnreadNotifications(member.account._id);
    });
  } catch (error) {
    logger.error(`Notification: ${error}`);
  }
};

module.exports.rejectAssociateRequest = async (
  companyId,
  associateCompany,
  adminUser,
) => {
  try {
    const company = await findCompanyById(companyId);
    let associateAdminSuperAdminList =
      await companyAdminSuperAdminList(associateCompany);
    let notification = await createNotification(
      notificationBuilder(
        `${_.upperFirst(
          company.name,
        )} rejected your partner request.`,
        'associate',
        associateCompany,
        null,
        null,
        null,
        null,
        null,
        companyId,
        null,
        null,
        adminUser._id,
      ),
    );
    associateAdminSuperAdminList.forEach(async (member) => {
      notification = await notification
        .populate('company', 'uniqueName _id')
        .execPopulate();
      let userNotification = await createNotificationForUser(
        userNotificationBuilder(notification._id, member.account._id),
      );
      userNotification = {
        ...userNotification._doc,
        notification,
      };
      sendNotification(
        member.account._id,
        userNotification,
        adminUser.pusherSock,
      );
      await triggerUnreadNotifications(member.account._id);
    });
  } catch (error) {
    logger.error(`Notification: ${error}`);
  }
};

module.exports.acceptAssociateRequest = async (
  companyId,
  associateCompany,
  adminUser,
) => {
  try {
    const company = await findCompanyById(companyId);
    let associateAdminSuperAdminList =
      await companyAdminSuperAdminList(associateCompany);
    let notification = await createNotification(
      notificationBuilder(
        `${_.upperFirst(
          company.name,
        )} accepted your partner request.`,
        'associate',
        associateCompany,
        null,
        null,
        null,
        null,
        null,
        companyId,
        null,
        null,
        adminUser._id,
      ),
    );
    associateAdminSuperAdminList.forEach(async (member) => {
      notification = await notification
        .populate('company', 'uniqueName _id')
        .execPopulate();
      let userNotification = await createNotificationForUser(
        userNotificationBuilder(notification._id, member),
      );
      userNotification = {
        ...userNotification._doc,
        notification,
      };
      sendNotification(
        member.account._id,
        userNotification,
        adminUser.pusherSock,
      );
      await triggerUnreadNotifications(member.account);
    });
  } catch (error) {
    logger.error(`Notification: ${error}`);
  }
};
// TODO: this service is not working
module.exports.createTeamAddNotification = async (
  senderName,
  companyId,
  projectName,
  newMembers,
  adminUser,
) => {
  try {
    let senderFullName = await findAccountById(senderName);
    let project = await Project.findById({ _id: projectName }).select(
      'name',
    );
    let notification = await createNotification(
      notificationBuilder(
        `${_.upperFirst(senderFullName.firstName)} ${_.upperFirst(
          senderFullName.lastName,
        )} added you in project ${project.name} `,
        'team',
        null,
        project._id,
        null,
        null,
        null,
        null,
        companyId,
        null,
        null,
        adminUser._id,
      ),
    );
    notification = await notification
      .populate('company', 'uniqueName _id')
      .execPopulate();
    let userNotification = await createNotificationForUser(
      userNotificationBuilder(notification._id, newMembers),
    );
    userNotification = {
      ...userNotification._doc,
      notification,
    };
    await triggerUnreadNotifications(newMembers);
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
        `${_.upperFirst(account.firstName)} ${_.upperFirst(
          account.lastName,
        )} added you in task ${taskAssign.taskId.name} `,
        'task',
        null,
        taskAssign.taskId.project._id,
        null,
        taskAssign.taskId.boardId._id,
        taskAssign.taskId._id,
        null,
        companyId,
        taskAssign.taskId.columnId._id,
        null,
        adminUser._id,
      ),
    );
    notification = await notification
      .populate('company', 'uniqueName _id')
      .execPopulate();
    let userNotification = await createNotificationForUser(
      userNotificationBuilder(notification._id, reciever),
    );

    userNotification = {
      ...userNotification._doc,
      notification,
    };
    sendNotification(
      reciever,
      userNotification,
      adminUser.pusherSock,
    );
    await triggerUnreadNotifications(adminUser._id);
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
    let notification = await createNotification(
      notificationBuilder(
        `${_.upperFirst(senderFullName.firstName)} ${_.upperFirst(
          senderFullName.lastName,
        )} added you in subtask ${subTaskAssign.taskId.name} `,
        'subtask',
        null,
        subTaskAssign.taskId.project,
        null,
        subTaskAssign.taskId.boardId,
        subTaskAssign.taskId._id,
        subTaskAssign._id,
        companyId,
        subTaskAssign.taskId.columnId,
        null,
        adminUser._id,
      ),
    );
    notification = await notification
      .populate('company', 'uniqueName _id')
      .execPopulate();
    let userNotification = await createNotificationForUser(
      userNotificationBuilder(notification._id, reciever),
    );
    userNotification = {
      ...userNotification._doc,
      notification,
    };
    sendNotification(
      reciever,
      userNotification,
      adminUser.pusherSock,
    );
    await triggerUnreadNotifications(reciever);
  } catch (error) {
    logger.error(`Notification: ${error}`);
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
    let senderFullName = await findAccountById(senderName);
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
