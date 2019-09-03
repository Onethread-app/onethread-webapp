var admin = require('firebase-admin');
var fetch = require('axios');

var serviceAccount = require('./push-notification-js-firebase-adminsdk-vh99f-69f7f3cf43.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://push-notification-js.firebaseio.com'
});

var key =
  'AAAALjHIfVw:APA91bG4EzgevW2tI7PteCscleC7zZppslgJtl1PFuew5ja4oRGrkBLXo2gOBewkg20LKMP51vU6y2LHUtS0azKMJ8pTkBa0mig0OerLMG3zEDj9jf8AZiiWbH6RAUT3q4gx9KfQJDnp';
var to =
  'eqzC28wVTCU:APA91bEgpXqdMUhDjuv-QrR3FF7N2GoaHY60pB_aoCfU1WFDzd3YDV0cNmavhZsCYI6xYtoDX8X8bH8VdnEC3oSk8IyK0frTay9Gg672lPd9_NZZ5ndI48742Wm7uE5YVqBYLvJHlZXL';

// token management
var topic = '/topics/tea';
var registrationTokens = [
  'ceIy4olF-hs:APA91bF2maXA6pAfYC1tOiLsOiA1FbLe37dna6GnxgXCpn8ECkBTWoao_GrAvutNts65Cu5YeBNjq2Zjek7b02nJh0y5y6y2V2cROnLbXIRgv_sk2d7OF1o3kO2WHeQtMSh20YYILmkh',
  'f0YmslamGSk:APA91bGT_BGP92ZcP1VbFUs5JS0cIEwvW9hqW8u_Xhx5uGYRvDMy8a0NGodaNoL-Ni96oIMJZ9Xe3qDWMWL8CjaouLxUaXlkWfqMkfqGhZsWDmG4imZOrBz7eXVA2FJLxBD3MS-MqnX6'
];

exports.index = function(data) {
  admin
    .messaging()
    .subscribeToTopic(registrationTokens, topic)
    .then(function(response) {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log('Successfully subscribed to topic:', response);
      return response;
    })
    .catch(function(error) {
      console.log('Error subscribing to topic:', error);
      return error;
    });
  //
  fetch
    .post(
      'https://fcm.googleapis.com/fcm/send',
      JSON.stringify({
        priority: 'high',
        notification: {
          title: 'New Message from ' + data.account.email,
          body: data.text
        },
        data: data,
        to: topic
      }),
      {
        headers: {
          Authorization: 'key=' + key,
          'Content-Type': 'application/json'
        }
      }
    )
    .then(function(response) {
      console.log('done');
      return response;
    })
    .catch(function(error) {
      console.error(error);
      return error;
    });
  return 0;
};
