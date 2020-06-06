import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBCTcnRzUjTUslkcRMvVGUNEeJjlLWU1SE',
  authDomain: 'newone-96b5e.firebaseapp.com',
  databaseURL: 'https://newone-96b5e.firebaseio.com',
  projectId: 'newone-96b5e',
  storageBucket: 'newone-96b5e.appspot.com',
  messagingSenderId: '823132541283',
  appId: '1:823132541283:web:24f5a5d8fe003038',
};

const firebaseConfig = firebase.initializeApp(config);

export default firebaseConfig;
