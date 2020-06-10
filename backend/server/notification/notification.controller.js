const {Company} = require('../company/company.model');
const {Member} = require('../company/member/member.model');
const {Team} = require('../team-member/team.model');
const Notification = require('./notification.model');
const {ObjectId} = require('mongoose').Types;
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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const {adminFirebase} = require('../services/firebase.services');

module.exports.userTokenFCM = async (req, res, next) => {
    const topic = `${req.body.company}-${req.body.role}`;
    adminFirebase
        .messaging()
        .subscribeToTopic(req.body.token, topic)
        .then(function (response) {
            // See the MessagingTopicManagementResponse reference documentation
            // for the contents of response.
            // console.log('Successfully subscribed to topic:', response);
            return res.status(200).json({message: 'success'});
        })
        .catch(function (error) {
            logger.error(`${error}`);
            // next(error);
        });
=======


=======
>>>>>>> 6d92f22e... Dev (#202)
const { adminFirebase } = require('./../services/firebase.services');

module.exports.userTokenFCM = async (req, res, next) => {
  let topic = `${req.body.company}-${req.body.role}`;
<<<<<<< HEAD
  adminFirebase.messaging().subscribeToTopic(req.body.token, topic)
  .then((response) => {
    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
    //console.log('Successfully subscribed to topic:', response);
    return res
          .status(200)
          .json({ message: 'success' });
  })
  .catch((error) => {
  
    logger.error(`${error}`);
    //next(error);
  });
>>>>>>> 0db3de3c... Feat/notification (#198)
};

=======


=======
>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
const { adminFirebase } = require('./../services/firebase.services');

module.exports.userTokenFCM = async (req, res, next) => {
  let topic = `${req.body.company}-${req.body.role}`;
<<<<<<< HEAD
  adminFirebase.messaging().subscribeToTopic(req.body.token, topic)
  .then(function(response) {
    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
    //console.log('Successfully subscribed to topic:', response);
    return res
          .status(200)
          .json({ message: 'success' });
  })
  .catch(function(error) {
  
    logger.error(`${error}`);
    //next(error);
  });
=======
=======
>>>>>>> 6d92f22e... Dev (#202)
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
      //next(error);
    });
<<<<<<< HEAD
>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
=======
>>>>>>> 6d92f22e... Dev (#202)
};

>>>>>>> fb2e0789... Wip/multicompmany (#180) (#184)
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
    company, // fromHeader
    newMembers,
    adminUser,
) => {
    try {
        let membersToSendNotification = await Member.find({
            $or: [{role: 'superAdmin'}, {role: 'admin'}],
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
            const usersNotifications = await membersToSendNotification.map(
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
        // next(error);
    }
};

module.exports.createTeamAddNotification = async (
    project, // fromHeader
    newMembers,
    adminUser,
) => {
    try {
        const members = await Member.find({
            $or: [{role: 'superAdmin'}, {role: 'admin'}],
            company: project.company,
        });

        const teamMembers = await Team.find({
            $or: [{role: 'projectModerator'}, {role: 'admin'}],
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
        const projectRoleReciver = ['modarator'];
        sendCompanyAndProjectNotification(
            project,
            companyRoleReciver,
            projectRoleReciver,
            adminUser,
            notifications,
        );

        notifications = await Notification.create(notifications);

        const usersAccountNotificationCollegue = members.map((m) => {
            return m.account.toString();
        });

        const usersAccountNotificationTeam = teamMembers.map((m) => {
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
            const usersNotificationAll = allNotificationReciver.map((m) => {
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
        // next(error);
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
<<<<<<< HEAD
    // sendCompanyNotification(company, adminUser, usersNotification);
    try {
        let members = await Member.find({
            $or: [{role: 'superAdmin'}, {role: 'admin'}],
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

        const usersNotification = members.map((m) => {
            return {
                notification: notification._id,
                account: m.account,
            };
        });

        const companyRoleReciver = ['superAdmin', 'admin'];
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

module.exports.createBoardNotification = async (board, adminUser, text) => {
    // sendCompanyNotification(company, adminUser, usersNotification);
    try {
        const members = await Member.find({
            $or: [{role: 'superAdmin'}, {role: 'admin'}],
            company: board.company,
        });

        const teamMembers = await Team.find({
            $or: [{role: 'projectModerator'}, {role: 'admin'}],
            project: board.project,
        });

        const notification = new Notification({
            type: 'board',
            text: text,
            account: adminUser._id,
            project: board.project,
            board: board._id,
            company: board.company,
        });

        const usersAccountNotificationCollegue = members.map((m) => {
            return m.account.toString();
        });

        const usersAccountNotificationTeam = teamMembers.map((m) => {
            return m.account.toString();
        });

        let allNotificationReciver = _.union(
            usersAccountNotificationCollegue,
            usersAccountNotificationTeam,
        );
        allNotificationReciver = allNotificationReciver.filter(
            (m) => m !== adminUser._id.toString(),
        );

        const usersNotificationAll = allNotificationReciver.map((m) => {
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

        // project role wise notification incomplete

        const companyRoleReciver = ['superAdmin', 'admin'];
        const companyEvent = board.company; //

        const projectRoleReciver = ['modarator'];
        // let projectEvent =  project._id; //

        sendCompanyAndProjectNotification(
            {company: board.company, _id: board.project},
            companyRoleReciver,
            projectRoleReciver,
            adminUser,
            notification,
        );

        await notification.save();
        await UserNotification.create(usersNotificationAll);
    } catch (error) {
        logger.error(`Board notification: ${error}`);

        // next(error);
    }
};
=======
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
>>>>>>> 0db3de3c... Feat/notification (#198)

module.exports.list = async (req, res, next) => {
    const {limit = 50, skip = 0, companyId} = req.query;

    try {
        const count = await UserNotification.aggregate([
            {$match: {account: new ObjectId(req.user._id)}},

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
            {$group: {_id: '$seen', count: {$sum: 1}}},
        ]);

        const resultCompany = await UserNotification.aggregate([
            {$match: {account: new ObjectId(req.user._id)}},

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
            // { "$unwind": "$docs" },

            {$limit: +limit},
            {$skip: +skip},
        ]);
        const unseenCount =
            count.length < 2
                ? 0
                : count[0]._id
                ? count[1].count
                : count[0].count;
        return sendJSONresponse(res, 200, {
            result: resultCompany,
            unseenCount: unseenCount,
        });

        // let option = {
        //   path: 'notification',
        //   select: '_id text type company',
        //   populate: [
        //     {
        //       path: 'company',
        //       select: '_id name',
        //     },
        //     {
        //       path: 'project',
        //       select: '_id name',
        //     },
        //   ],
        // };

        // await UserNotification.find({
        //   account: req.user._id,
        //   // 'notification.company' : new ObjectId(req.params.companyId)
        // })
        //   .select('_id read notification account createdAt')
        //   .populate(option)
        //   .sort({ createdAt: -1 })
        //   .skip(+skip)
        //   .limit(+limit)
        //   .exec()
        //   .then((result) => {
        //     return sendJSONresponse(res, 200, result);
        //   });
    } catch (error) {
        logger.error(`${error}`);
        next(error);
    }
};

module.exports.seen = async (req, res, next) => {
    const result = await UserNotification.aggregate([
        {$match: {account: new ObjectId(req.user._id)}},

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
        // { "$unwind": "$docs" },
    ]);
    const seenNoti = result.map((c) => {
        return c._id;
    });

<<<<<<< HEAD
    await UserNotification.updateMany(
        {_id: {$in: seenNoti}},
        {$set: {seen: true}},
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
    const count = await UserNotification.aggregate([
        {$match: {account: new ObjectId(req.user._id)}},

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
        {$group: {_id: '$read', count: {$sum: 1}}},
    ]);

    const resultCompany = await UserNotification.aggregate([
        {$match: {account: new ObjectId(req.user._id)}},

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
        // { "$unwind": "$docs" },

        {$limit: 5},
        {$skip: 0},
    ]);

    return sendJSONresponse(res, 200, {
        result: resultCompany,
        unreadCount: count[1].count,
    });
};
=======
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

module.exports.list = async (req, res, next) => {
  const { limit = 50, skip = 0, companyId } = req.query;

  try {
<<<<<<< HEAD
<<<<<<< HEAD

    let count = await UserNotification.aggregate(
      [
          { '$match': {'account' : new ObjectId(req.user._id)}},
           
          { "$lookup": {     
                  "from": "notifications",     
                  "localField": "notification",     
                  "foreignField": "_id",     
                  "as": "notification"   
          }}, 
          {"$unwind": {
                  "path": "$notification"
              }
          },
          { '$match': { "notification.company": new ObjectId(req.params.companyId)}},
          {'$group':{'_id': '$seen', 'count':{'$sum':1}} }
          
      ]
  );
      
  let resultCompany = await UserNotification.aggregate(
      [
          { '$match': {'account' : new ObjectId(req.user._id)}},
           
          { "$lookup": {     
                  "from": "notifications",     
                  "localField": "notification",     
                  "foreignField": "_id",     
                  "as": "notification"   
          }}, 
          {"$unwind": {
                  "path": "$notification"
              }
          },
          { '$match': { "notification.company": new ObjectId(req.params.companyId)}},
         // {'$group':{'_id': '$read', 'count':{'$sum':1},"docs": { "$push": "$$ROOT" }} },
          //{ "$unwind": "$docs" },
          
          { "$limit": +limit },
          { "$skip": +skip }
      ]
<<<<<<< HEAD
  );
let unseenCount = count.length < 2 ? 0 :  count[0]._id ? count[1].count : count[0].count;
  
  return sendJSONresponse(res, 200, {result:resultCompany, unseenCount: unseenCount});
=======
  )
  
  return sendJSONresponse(res, 200, {result:resultCompany, unseenCount: count[0].count});
>>>>>>> fb2e0789... Wip/multicompmany (#180) (#184)
=======
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
      { $group: { _id: '$seen', count: { $sum: 1 } } },
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

      { $limit: +limit },
      { $skip: +skip },
    ]);
    let unseenCount =
      count.length < 2
        ? 0
        : count[0]._id
        ? count[1].count
        : count[0].count;
    return sendJSONresponse(res, 200, {
      result: resultCompany,
      unseenCount: unseenCount,
    });

>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
=======
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
      { $group: { _id: '$seen', count: { $sum: 1 } } },
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

      { $limit: +limit },
      { $skip: +skip },
    ]);
    let unseenCount =
      count.length < 2
        ? 0
        : count[0]._id
        ? count[1].count
        : count[0].count;
    return sendJSONresponse(res, 200, {
      result: resultCompany,
      unseenCount: unseenCount,
    });

>>>>>>> 6d92f22e... Dev (#202)
    // let option = {
    //   path: 'notification',
    //   select: '_id text type company',
    //   populate: [
    //     {
    //       path: 'company',
    //       select: '_id name',
    //     },
    //     {
    //       path: 'project',
    //       select: '_id name',
    //     },
    //   ],
    // };

    // await UserNotification.find({
    //   account: req.user._id,
    //   // 'notification.company' : new ObjectId(req.params.companyId)
    // })
    //   .select('_id read notification account createdAt')
    //   .populate(option)
    //   .sort({ createdAt: -1 })
    //   .skip(+skip)
    //   .limit(+limit)
    //   .exec()
    //   .then((result) => {
    //     return sendJSONresponse(res, 200, result);
    //   });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
};

module.exports.seen = async (req, res, next) => {
  let result = await UserNotification.aggregate([
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
  ]);
  let seenNoti = result.map((c) => {
    return c._id;
  });

  await UserNotification.updateMany(
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    { _id: { "$in" : seenNoti} },
=======
    { account: req.user._id, 'notification.company' : req.params.companyId },
>>>>>>> fb2e0789... Wip/multicompmany (#180) (#184)
=======
    { _id: { $in: seenNoti } },
>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
=======
    { _id: { $in: seenNoti } },
>>>>>>> 6d92f22e... Dev (#202)
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

<<<<<<< HEAD


<<<<<<< HEAD
>>>>>>> 0db3de3c... Feat/notification (#198)
=======
=======
>>>>>>> 6d92f22e... Dev (#202)
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
>>>>>>> fb2e0789... Wip/multicompmany (#180) (#184)

module.exports.read = async (req, res, next) => {
    await UserNotification.updateOne(
        {
            notification: req.params.userNotificationId,
            account: req.user._id,
        }, // notUserNotification
        {$set: {read: true}},
    )
        .exec()
        .then((result) => {
            logger.info(`${result}`);
            return sendJSONresponse(res, 200, {read: true});
        })
        .catch((e) => {
            logger.log(`${e}`);
            next(e);
        });
};
<<<<<<< HEAD
<<<<<<< HEAD

<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> fb2e0789... Wip/multicompmany (#180) (#184)
=======

>>>>>>> fb4e4471... Wip/backend/announcement (#171) (#185)
=======
>>>>>>> e8fd5de7... Wip/project type associates (#199) (#203)
=======
>>>>>>> 6d92f22e... Dev (#202)
