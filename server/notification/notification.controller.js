
const { Company } = require('../company/company.model');
const { Member } = require('../company/member/member.model');
const { Team } = require('../team-member/team.model');
const  Notification  = require('./notification.model');
const  UserNotification  = require('./userNotification.model');
const _ = require('lodash');
const {
  sendMultipleNotification,
  sendBoardNotification,
  sendCompanyNotification
} = require('../services/notification.services');
const logger = require('../../config/winston');
const { sendJSONresponse , sendErrorResponse } = require('../helpers/jsonResponse');


module.exports.createCompanyNotification = async (
  company,//fromHeader
  adminUser,
) => {

  const members = await Member.find({
    $or:[ {role: 'superAdmin'}, {role: 'admin'}],
    company: company,
  });

  let notification = new Notification({
    type: 'companyProfile',
    text: `company profile has been updated by ${adminUser.name}`,
    account: adminUser._id,
    company: company,
  });

  
  let usersNotifications = members.map(m => {
    return {
      notification: notification._id,
      account: m.account,
    };
  });
  
  sendCompanyNotification(company, adminUser, notification);
  
  await notification.save();
  await UserNotification.create(usersNotifications);
};

module.exports.createMemberAddNotification = async (
  company,//fromHeader
  newMembers,
  adminUser
  
) => {
  try{
    const membersToSendNotification = await Member.find({
      $or:[ {role: 'superAdmin'}, {role: 'admin'}],
      company: company,
    });
    

    // let notification = new Notification({
    //   type: 'companyProfile',
    //   text: `company profile has been updated by ${adminUser.name}`,
    //   account: adminUser._id,
    //   company: company,
    // });
    
    let notifications = newMembers.map(m => {
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
    
    sendMultipleNotification(company, adminUser, notifications);
    
    notifications = await Notification.create(notifications);
    
    const promises = [];

    for (let i = 0; i < notifications.length ; i += 1) {
      console.log(12,notifications);
      let usersNotifications = await membersToSendNotification.map(m => {
        return {
          notification: notifications[i]._id,
          account: m.account,
        };
      });
      
      UserNotification.create(usersNotifications);
     
    }
    
  } catch (error) {
    console.log(error);
    logger.error(`${error}`);
    //next(error);
  }

};

module.exports.createAssociateNotification = async (
  company, adminUser,text
) => {

  //sendCompanyNotification(company, adminUser, usersNotification);

  const members = await Member.find({
    $or:[ {role: 'superAdmin'}, {role: 'admin'}],
    company: company,
  });



  let notification = new Notification({
    type: 'associate',
    text: text,
    account: adminUser._id,
    company: company,
  });

  
  let usersNotification = members.map(m => {
    return {
      notification: notification._id,
      account: m.account,
    };
  });

  sendCompanyNotification(company._id, adminUser, notification);

  await notification.save();
  await UserNotification.create(usersNotification);
};

module.exports.createBoardNotification = async (
  project, adminUser,text
) => {

  //sendCompanyNotification(company, adminUser, usersNotification);
try{
  const members = await Member.find({
    $or:[ {role: 'superAdmin'}, {role: 'admin'}],
    company: project.company,
  });

  const teamMembers = await Team.find({
    $or:[ {role: 'projectModerator'}, {role: 'admin'}],
    company: project.company,
  });

  let notification = new Notification({
    type: 'board',
    text: text,
    account: adminUser._id,
    company: project.company,
  });

  
  let usersNotificationCollegue = members.map(m => {
    return {
      notification: notification._id,
      account: m.account,
    };
  });

  let usersNotificationTeam = teamMembers.map(m => {
    return {
      notification: notification._id,
      account: m.account,
    };
  });



  //project role wise notification incomplete

  let companyRoleReciver = ['superAdmin', 'admin'];
  let companyEvent =  project.company; //

   let projectRoleReciver = ['modarator', 'admin'];
  // let projectEvent =  project._id; //


  sendBoardNotification(project, companyRoleReciver, projectRoleReciver, adminUser, notification);

  await notification.save();
  await UserNotification.create(_.union(usersNotificationCollegue, usersNotificationTeam));
} catch (error) {
  console.log(error);
  logger.error(`Board create: ${error}`);
  
  //next(error);
}

};

module.exports.list   = async (req, res, next) => {
  const { limit = 50, skip = 0, companyId } = req.query;

  await UserNotification.find(
    { 
      account: req.user._id
    }
  )
    .select('_id read notification account')
    .populate('notification', '_id text type')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(result => {
      
      logger.info(`${result}`);
      return sendJSONresponse(res, 200, result);
    })
    .catch(e => {
      console.log(e);  
      next(e)
    });
};

module.exports.seen   = async (req, res, next) => {
  
  await UserNotification.updateMany(
    { account: req.user._id },
    { $set: { seen: true } }
    ).exec()
    .then(result => {
      
      logger.info(`${result}`);
      return sendJSONresponse(res, 200, { seen: true });
    })
    .catch(e => {
      console.log(e);  
      next(e)
    });
};

module.exports.read   = async (req, res, next) => {
  
  await UserNotification.updateOne(
    { _id: req.params.notificationId }, //notUserNotification
    { $set: { read: true } }
    ).exec()
    .then(result => {
      
      logger.info(`${result}`);
      return sendJSONresponse(res, 200, { read: true });
    })
    .catch(e => {
      console.log(e);  
      next(e)
    });

};




