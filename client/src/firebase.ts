import firebase from 'firebase/app';
import 'firebase/messaging';

const config = {
  apiKey: "AIzaSyAT-A7TOxre30PJWMUYcSrSF9uqOEwymh0",
  authDomain: "onethread-d2992.firebaseapp.com",
  projectId: "onethread-d2992",
  storageBucket: "onethread-d2992.appspot.com",
  messagingSenderId: "399728662753",
  appId: "1:399728662753:web:59417673b698f315787fa0"
};

// const firebaseConfig =
firebase.initializeApp(config);
const messaging = firebase.messaging();

export const getToken = async (setTokenFound) => {
  return messaging
    .getToken({
      vapidKey:
        'BFlYQph_gwTpJ-rYlS-CmGVeamgP9akluznKypTkRk1IQHm3KMJVeX_17ZPPdWOXHtgQTMi-2yc9ac9LxswMmQI',
    })
    .then((currentToken) => {
      if (currentToken) {
        
        setTokenFound(true);
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log(
          'No registration token available. Request permission to generate one.',
        );
        setTokenFound(false);
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      
      // catch error while creating client token
    });
};

export const onMessageListener = () =>
messaging.onMessage(p=>{

});
//  new Promise((resolve) => {
//    
// messaging.onMessage((payload) => {
//   
//     resolve(payload);
// });
// });

// export default firebaseConfig;
