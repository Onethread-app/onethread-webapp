const express = require('express');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const { permit, authSelf } = require('../helpers/permission');

const router = express.Router(); // eslint-disable-line new-cap

// create a room for a company
router
  .route('/')
  .post(
    requireAuth,
    permit('user', 'admin'),
    validate(paramValidation.createRoom),
    roomCtrl.create,
  );

router
  .route('/:company')
  .get(requireAuth, permit('user', 'admin'), roomCtrl.list);

router
  .route('/search/:company')
  .get(requireAuth, roomCtrl.roomMemberSearch);

//   .delete(requireAuth, authSelf('save'), roomCtrl.remove);

module.exports = router;
