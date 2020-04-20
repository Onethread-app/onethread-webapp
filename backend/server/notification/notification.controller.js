const { Company } = require('../company/company.model');
const { Member } = require('../company/member/member.model');
const { Team } = require('../team-member/team.model');
const Notification = require('./notification.model');
const ObjectId = require('mongoose').Types.ObjectId;
const UserNotification = require('./userNotification.model');
const _ = require('lodash');
const {
  sendMultipleNotification,

  sendCompanyRoleNotification,
  sendCompanyAndProjectNotification,
  sendCompanyNotification,
} = require('../services/notification.services');
const logger = require('../../config/winston');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');

// module.exports.createCompanyNotification = async (
//   company, //fromHeader
//   adminUser,
// ) => {
//   const members = await Member.find({
//     $or: [{ role: 'superAdmin' }, { role: 'admin' }],
//     company: company,
//   });

//   let notification = new Notification({
//     type: 'companyProfile',
//     text: `company profile has been updated by ${adminUser.name}`,
//     account: adminUser._id,
//     company: company,
//   });

//   let usersNotifications = members.map(m => {
//     return {
//       notification: notification._id,
//       account: m.account,
//     };
//   });

//   sendCompanyNotification(company, adminUser, notification);

//   await notification.save();
//   await UserNotification.create(usersNotifications);
// };

module.exports.createMemberAddNotification = async (
  company, //fromHeader
  newMembers,
  adminUser,
) => {
  try {
    let membersToSendNotification = await Member.find({
      $or: [{ role: 'superAdmin' }, { role: 'admin' }],
      company: company,
    });
    membersToSendNotification = membersToSendNotification.filter(
      (m) => m.account.toString() !== adminUser._id.toString(),
    );

    // let notification = new Notification({
    //   type: 'companyProfile',
    //   text: `company profile has been updated by ${adminUser.name}`,
    //   account: adminUser._id,
    //   company: company,
    // });

    let notifications = newMembers.map((m) => {
      return {
        type: 'colleague',
        text: `GA has added ${m.account.name}`,
        account: adminUser._id,
        company: company,
      };
    });

    // let usersNotifications = membersToSendNotification.map(m => {
    //   return {
    //     notification: notification._id,
    //     account: m.account,
    //   };
    // });

    const companyRoleReciver = ['superAdmin', 'admin'];
    sendMultipleNotification(
      company,
      companyRoleReciver,
      adminUser,
      notifications,
    );

    notifications = await Notification.create(notifications);

    const promises = [];

    for (let i = 0; i < notifications.length; i += 1) {
      let usersNotifications = await membersToSendNotification.map(
        (m) => {
          return {
            notification: notifications[i]._id,
            account: m.account,
          };
        },
      );

      UserNotification.create(usersNotifications);
    }
  } catch (error) {
    logger.error(`${error}`);
    //next(error);
  }
};

module.exports.createTeamAddNotification = async (
  project, //fromHeader
  newMembers,
  adminUser,
) => {
  try {
    const members = await Member.find({
      $or: [{ role: 'superAdmin' }, { role: 'admin' }],
      company: project.company,
    });

    const teamMembers = await Team.find({
      $or: [{ role: 'projectModerator' }, { role: 'admin' }],
      company: project._id,
    });

    // let notification = new Notification({
    //   type: 'companyProfile',
    //   text: `company profile has been updated by ${adminUser.name}`,
    //   account: adminUser._id,
    //   company: company,
    // });

    let notifications = newMembers.map((m) => {
      return {
        type: 'team',
        text: `PA has added ${m.account.name}`,
        account: adminUser._id,
        project: project._id,
        company: project.company,
      };
    });

    // let usersNotifications = membersToSendNotification.map(m => {
    //   return {
    //     notification: notification._id,
    //     account: m.account,
    //   };
    // });

    const companyRoleReciver = ['superAdmin', 'admin'];
    let projectRoleReciver = ['modarator'];
    sendCompanyAndProjectNotification(
      project,
      companyRoleReciver,
      projectRoleReciver,
      adminUser,
      notifications,
    );

    notifications = await Notification.create(notifications);

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

    for (let i = 0; i < notifications.length; i += 1) {
      let usersNotificationAll = allNotificationReciver.map((m) => {
        return {
          notification: notifications[i]._id,
          account: m,
        };
      });

      // let usersNotificationCollegue = await members.map(m => {
      //   return {
      //     notification: notification._id,
      //     account: m.account,
      //   };
      // });

      // let usersNotificationTeam = await teamMembers.map(m => {
      //   return {
      //     notification: notification._id,
      //     account: m.account,
      //   };
      // });

      UserNotification.create(usersNotificationAll);
    }
  } catch (error) {
    logger.error(`${error}`);
    //next(error);
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

    let notification = new Notification({
      type: type,
      text: text,
      account: adminUser._id,
      company: company,
    });

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
  project,
  adminUser,
  text,
) => {
  //sendCompanyNotification(company, adminUser, usersNotification);
  try {
    const members = await Member.find({
      $or: [{ role: 'superAdmin' }, { role: 'admin' }],
      company: project.company,
    });

    const teamMembers = await Team.find({
      $or: [{ role: 'projectModerator' }, { role: 'admin' }],
      project: project._id,
    });

    let notification = new Notification({
      type: 'board',
      text: text,
      account: adminUser._id,
      project: project._id,
      company: project.company,
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
    let companyEvent = project.company; //

    let projectRoleReciver = ['modarator'];
    // let projectEvent =  project._id; //

    sendCompanyAndProjectNotification(
      project,
      companyRoleReciver,
      projectRoleReciver,
      adminUser,
      notification,
    );

    await notification.save();
    await UserNotification.create(usersNotificationAll);
  } catch (error) {
    logger.error(`Board create: ${error}`);

    //next(error);
  }
};

module.exports.list = async (req, res, next) => {
  const { limit = 50, skip = 0, companyId } = req.query;

  try {
    let option = {
      path: 'notification',
      select: '_id text type company',
      populate: [
        {
          path: 'company',
          select: '_id name',
        },
        {
          path: 'project',
          select: '_id name',
        },
      ],
    };

    await UserNotification.find({
      account: req.user._id,
    })
      .select('_id read notification account createdAt')
      .populate(option)
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec()
      .then((result) => {
        return sendJSONresponse(res, 200, result);
      });

    // console.log(1,req.params.companyId)

    // UserNotification.aggregate()
    // //.project('notification')
    // .match({'account' : new ObjectId(req.user._id)})
    // .unwind('notification')
    // //.unwind('$notification.company')
    // .match({'notification.company' : new ObjectId(req.params.companyId)})
    // .exec()
    // .then(result => {
    //   console.log(result);
    //   logger.info(`${result}`);
    //   return sendJSONresponse(res, 200, result);
    // });
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
      return sendJSONresponse(res, 200, { seen: true });
    })
    .catch((e) => {
      logger.error(`${e}`);
      next(e);
    });
};

module.exports.read = async (req, res, next) => {
  await UserNotification.updateOne(
    {
      notification: req.params.userNotificationId,
      account: req.user._id,
    }, //notUserNotification
    { $set: { read: true } },
  )
    .exec()
    .then((result) => {
      logger.info(`${result}`);
      return sendJSONresponse(res, 200, { read: true });
    })
    .catch((e) => {
      logger.log(`${e}`);
      next(e);
    });
};
