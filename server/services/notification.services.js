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
) => {
  const userNotification = { notification: {
    account: adminUser,
    type: 'companyProfile',
  }
};
  
  channels_client.trigger(
    'hello', 
    `${company}-superAdmin`,
     userNotification
     );

};

