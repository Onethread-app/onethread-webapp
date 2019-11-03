'use strict';

<<<<<<< HEAD
=======

>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
const express = require('express');
const validate = require('express-validation');
const passport = require('passport');
const paramValidation = require('./room.validation');
const roomCtrl = require('./room.controller');

const requireAuth = passport.authenticate('jwt', { session: false });
const { permit, authSelf } = require('../helpers/permission');

<<<<<<< HEAD
=======

>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/')
<<<<<<< HEAD
=======
  .get(requireAuth, permit('user', 'admin'), roomCtrl.list)
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
  .post(
    requireAuth,
    permit('user', 'admin'),
    validate(paramValidation.createRoom),
<<<<<<< HEAD
    roomCtrl.create,
  );

router
  .route('/:company')
  .get(requireAuth, permit('user', 'admin'), roomCtrl.list);

router
  .route('/search/:company')
  .get(requireAuth, roomCtrl.roomMemberSearch);

//   .delete(requireAuth, authSelf('save'), roomCtrl.remove);
=======
    roomCtrl.create
  );

  

 router
   .route('/:company')
   .get(requireAuth, permit('user', 'admin'), roomCtrl.list);
//   .delete(requireAuth, authSelf('save'), roomCtrl.remove); 


>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058

module.exports = router;
