const Pusher = require("pusher");
const _ = require('lodash');

let channels_client = new Pusher({
    appId: '858307',
    key: '2d2483157c37a8782f19',
    secret: '45076d25b7f1dad63f12',
    cluster: 'ap2',
    useTLS: true,
  });


module.exports.sendCompanyNotification = async (
  company,//fromHeader
  adminUser,
  userNoti,
) => {
  let userNotification = userNoti;

  userNotification = { notification: userNotification
  };
  console.log(1,company);
  channels_client.trigger(
    company.toString(), 
    `${company}-superAdmin`,
     userNotification
     );

};

module.exports.sendCompanyRoleNotification = async (
  company,//fromHeader
  companyChannels,
  adminUser,
  userNoti,
) => {
  let companyChannelsPusher = companyChannels.map(c => {
    return `${company.toString()}-${c}`;
  });

  let userNotification = userNoti;

  userNotification = { notification: userNotification
  };
  
  channels_client.trigger(
    companyChannelsPusher, 
    company.toString(), 
     userNotification
     );

};

module.exports.sendMultipleNotification = async (
  company,//fromHeader
  adminUser,
  userNoties,
) => {
  let userNotifications = userNoties;

  // userNotification = { notification: userNotification
  // };
  console.log(1,company);
  channels_client.trigger(
    company.toString(), 
    `${company}-superAdmin`,
    userNotifications//ARRAY
     );

};

module.exports.sendBoardNotification = async (
  
  project,
  companyChannels,
  projectChannel,
  adminUser,
  userNoti,
) => {

  let companyChannelsPusher = companyChannels.map(c => {
    return `${project.company.toString()}-${c}`;
  });

  let projectChannelPusher = projectChannel.map(p => {
    return `${project._id.toString()}-${p}`;
  });

  let allChannel = _.union(companyChannelsPusher, projectChannelPusher)

  let userNotification = userNoti;

  userNotification = { notification: userNotification
  };
  console.log(1,project.company,allChannel);
  channels_client.trigger(
    allChannel, 
    project.company.toString(), 
     userNotification
     );

};

module.exports.sendMultiChannelNotification = async (
  companyChannels,//fromHeader
  adminUser,
  userNoti,
) => {
  let userNotification = userNoti;

  userNotification = { notification: userNotification
  };
  console.log(1,company);
  channels_client.trigger(
    companyChannels,// `${company}-superAdmin` this type chennel
    
    company,
     userNotification
     );

};

