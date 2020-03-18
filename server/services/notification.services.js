const Pusher = require("pusher");

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

