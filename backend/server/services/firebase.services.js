<<<<<<< HEAD
<<<<<<< HEAD
const adminFirebase = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

adminFirebase.initializeApp({
    credential: adminFirebase.credential.cert(serviceAccount),
    databaseURL: 'https://newone-96b5e.firebaseio.com',
});

module.exports = {
    adminFirebase,
=======
=======
>>>>>>> fb4e4471... Wip/backend/announcement (#171) (#185)
let adminFirebase = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

adminFirebase.initializeApp({
  credential: adminFirebase.credential.cert(serviceAccount),
  databaseURL: "https://newone-96b5e.firebaseio.com"
});


module.exports = {
  adminFirebase,
<<<<<<< HEAD
>>>>>>> b5ba006a... Wip/backend/announcement (#171) (#185)
=======
>>>>>>> fb4e4471... Wip/backend/announcement (#171) (#185)
};
