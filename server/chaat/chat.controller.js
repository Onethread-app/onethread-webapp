//arif topic

var admin = require('firebase-admin');
var fetch = require('axios');
const Chatsingle = require('./chat.model');
const ChatRoom = require('./chatroom.model');

const serviceAccount = require("../newone-96b5e-firebase-adminsdk-bwij7-9d28bb5925.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://push-notification-js.firebaseio.com'
});

const key =
  'AAAALjHIfVw:APA91bG4EzgevW2tI7PteCscleC7zZppslgJtl1PFuew5ja4oRGrkBLXo2gOBewkg20LKMP51vU6y2LHUtS0azKMJ8pTkBa0mig0OerLMG3zEDj9jf8AZiiWbH6RAUT3q4gx9KfQJDnp';
// var to =
//   'eqzC28wVTCU:APA91bEgpXqdMUhDjuv-QrR3FF7N2GoaHY60pB_aoCfU1WFDzd3YDV0cNmavhZsCYI6xYtoDX8X8bH8VdnEC3oSk8IyK0frTay9Gg672lPd9_NZZ5ndI48742Wm7uE5YVqBYLvJHlZXL';

let topic = '/topics/tea';
let registrationTokens = [];


exports.create = function(req, res) {
  const chatsingle = new Chatsingle({
    text: req.body.text,
    account: req.user,
    reciver: req.body.reciver
  });

  Chatsingle.save()
    .then(result => {
      Chatsingle.findOne({ account: req.body.reciver })
        .then(result => {
          if (result) {
            registrationTokens.push(result.token);
            admin
              .messaging()
              .subscribeToTopic(registrationTokens, topic)
              .then(function(response) {
                // See the MessagingTopicManagementResponse reference documentation
                // for the contents of response.
                console.log('Successfully subscribed to topic:', response);
              })
              .catch(function(error) {
                console.log('Error subscribing to topic:', error);
              });

            var notification = {
              title: 'Portugal orvi. Denmark',
              body: '5 to 1'
            };
            var data = {
              //you can send only notification or only data(or include both)
              my_key: 'my value',
              message: 'my another value'
            };
            fetch
              .post(
                'https://fcm.googleapis.com/fcm/send',
                JSON.stringify({
                  notification: notification,
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
              })
              .catch(function(error) {
                console.error(error);
              });
            res.json(result);
          } else {
            return res
              .status(400)
              .json({ message: 'No valid entry found for provided ID' });
          }
        })
        .catch(err => {
          // console.log(err);
          next(err);
        });
    })
    .then(result => res.send(result))
    .catch(e => next(e));
};

exports.init = function(req, res) {

    const chatRoom = new ChatRoom({
        token: req.body.token,
      
        account: req.user
      });
    
      chatRoom
        .save()
        .then(result => res.send(result))
        .catch(e => next(e));

};





exports.index = function(req, res) {
  // fetch("https://fcm.googleapis.com/fcm/send", {
  //   method: "POST",
  //   headers: {
  //     "Authorization": "key=" + key,
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({
  //       notification: notification,
  //     to: to
  //   })
  // })
  fetch
    .post(
      'https://fcm.googleapis.com/fcm/send',
      JSON.stringify({
        notification: notification,
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
    })
    .catch(function(error) {
      console.error(error);
    });
  return 0;
};

//orvi to
// const FCM = require('fcm-node');
// const serverKey = 'AAAAfHLmONI:APA91bGTI4OljDKW0hYg8Yc6_X5bO-dSTCg-nocLv-i47gTe-SMld88CE3WudZxDzdUQvirSKIDQArLcL71kSzx7h7x5K9C1NBEMXn9-_3axExKuCzfflT2-buoY6DgaTMR_B80dZ44s'; //put your server key here
//     let fcm = new FCM(serverKey);

// exports.index = function(req, res) {

//   let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
//       to: 'e-M2wwFHjv4:APA91bGOPUPknGLsTBb0_y6Qyl8eTdLQ-AG3GWpj3Ah_NOnC5KOhlFBi1IFpkgnsN7Tl29Psi9gbt3AMUUHUm0E6JdfQCOCfsfVklvHoNMejMj6cRGKW_PcgvKqCQIEP1F8y86e_1e3s',
//       collapse_key: '6',

//       notification: {
//           title: 'Title of your push notification',
//           body: 'Body of your push notification'
//       },

//       data: {  //you can send only notification or only data(or include both)
//           my_key: 'my value',
//           message: 'my another value'
//       }
//   };

//   fcm.send(message, function(err, response){
//       if (err) {
//           console.log("Something has gone wrong!",err);
//           return 0;
//       } else {
//           console.log("Successfully sent with response: ", response);
//           return 0;
//       }
//   });

// };
