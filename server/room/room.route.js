'use strict';


const express = require('express');
const validate = require('express-validation');
const passport = require('passport');
const paramValidation = require('./room.validation');
const roomCtrl = require('./room.controller');

const requireAuth = passport.authenticate('jwt', { session: false });
const { permit, authSelf } = require('../helpers/permission');


const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/')
  //.get(requireAuth, permit('user', 'admin'), roomCtrl.list)
  .post(
    requireAuth,
    permit('user', 'admin'),
    validate(paramValidation.createRoom),
    roomCtrl.create
  );

  router
  .route('/workplace')
  .get(requireAuth, permit('user', 'admin'), roomCtrl.listByWorkplace);

// router
//   .route('/:roomId')
//   .get(requireAuth, permit('user', 'admin'), roomCtrl.get)
//   .delete(requireAuth, authSelf('save'), roomCtrl.remove); 

// router.param('roomId', roomCtrl.load);

module.exports = router;
