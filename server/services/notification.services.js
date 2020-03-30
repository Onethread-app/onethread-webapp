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

  userNotification = { notification: userNotification,
    read: false
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

  userNotification = { notification: userNotification,
    read: false
  };
  
  channels_client.trigger(
    companyChannelsPusher, 
    company.toString(), 
     [userNotification]
     );

};

module.exports.sendMultipleNotification = async (
  company,//fromHeader
  companyChannels,
  adminUser,
  userNoties,
) => {
  let userNotifications = userNoties.map(c => {
    return  { notification: c, read: false};
  });

  let companyChannelsPusher = companyChannels.map(c => {
    return `${company.toString()}-${c}`;
  });

  //let userNotifications = userNoties;

  // userNotification = { notification: userNotification
  // };
  console.log(1,company);
  channels_client.trigger(
    companyChannelsPusher, 
    company.toString(),
    userNotifications//ARRAY
     );

};

module.exports.sendCompanyAndProjectNotification = async (
  
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

  let allChannel = _.union(companyChannelsPusher, projectChannelPusher);

  let userNotification = userNoti;
  if(userNotification.length > 1){

    userNotification = userNoti.map(c => { //multiple
      return  { notification: c,
      read: false};
    });
    
  }else{
    userNotification = { notification: userNoti,
    read: false };
    userNotification = [userNotification];

  }
  
  
  console.log(1, userNotification, project.company,allChannel);
  channels_client.trigger(
    allChannel, 
    project.company.toString(), 
     userNotification
     );

};

// module.exports.sendMultiChannelNotification = async (
//   companyChannels,//fromHeader
//   adminUser,
//   userNoti,
// ) => {
//   let userNotification = userNoti;

//   userNotification = { notification: userNotification
//   };
//   console.log(1,company);
//   channels_client.trigger(
//     companyChannels,// `${company}-superAdmin` this type chennel
    
//     company,
//      userNotification
//      );

// };

