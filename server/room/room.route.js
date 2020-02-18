const express = require('express');
const passport = require('passport');
// const authorization = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const joiSchema = require('./room.validation');
const roomCtrl = require('./room.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');

const router = express.Router();

// create a room for a company
router
  .route('/')
  .post(
    authorization,
    SchemaValidator(joiSchema.createRoom),
    roomCtrl.create,
  );

// recheck mongodb room users with chatkit room users
router
  .route('/hot-fix')
  .post(
    authorization,
    SchemaValidator(joiSchema.recheckMembersWithChatkit),
    roomCtrl.recheckMembersWithChatkit,
  );

// get members for a room
router
  .route('/members/:roomId')
  .get(authorization, roomCtrl.memberList);

// add user into a company's room
router
  .route('/addUser')
  .post(
    authorization,
    SchemaValidator(joiSchema.addMembers),
    roomCtrl.addMembers,
  );

// get suggestions for adding members
router
  .route('/suggest-member/:roomId/:companyId')
  .get(authorization, roomCtrl.suggestMember);

// get rooms for a company
router.route('/:company').get(authorization, roomCtrl.list);

module.exports = router;
