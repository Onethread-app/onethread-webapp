const express = require('express');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const joiSchema = require('./room.validation');
const roomCtrl = require('./room.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');

const router = express.Router();

// create a room for a company
router
  .route('/')
  .post(
    requireAuth,
    SchemaValidator(joiSchema.createRoom),
    roomCtrl.create,
  );

// get rooms for a company
router.route('/:company').get(requireAuth, roomCtrl.list);

// get members for a room
router
  .route('/members/:roomId')
  .get(requireAuth, roomCtrl.memberList);

// add user into a company's room
router.route('/addUser').post(requireAuth, roomCtrl.addUsers);

// get suggestions for adding members
router
  .route('/suggest-member/:roomId/:companyId')
  .get(requireAuth, roomCtrl.suggestMember);

module.exports = router;
