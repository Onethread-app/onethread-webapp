const express = require('express');
// const authorization = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const joiSchema = require('./room.validation');
const roomCtrl = require('./room.controller');
const {
  authorizeProjectRole,
} = require('../middlewares/projectRoleMiddleware');
const SchemaValidator = require('./../helpers/joiSchemaValidator');

const router = express.Router();

// create a room for a company
router
  .route('/')
  .post(
    authorization,
    SchemaValidator(joiSchema.createRoom),
    authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    roomCtrl.create,
  );

router
  .route('/:roomId/archive')
  .put(
    authorization,
    SchemaValidator(joiSchema.archiveRoom),
    roomCtrl.archiveRoom,
  );

// get members for a room
router
  .route('/members/:roomId')
  .get(authorization, roomCtrl.memberList);

// update last seen for member in a room
router
  .route('/last-seen/:roomId')
  .put(
    authorization,
    SchemaValidator(joiSchema.updateLastSeen),
    roomCtrl.updateLastSeen,
  );

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
  .route('/suggest-member')
  .get(authorization, roomCtrl.suggestMember);

router
  .route('/list') // for project
  .get(
    authorization,
    SchemaValidator(joiSchema.getProjectRooms),
    roomCtrl.list,
  );

router.route('/chats').get(authorization, roomCtrl.chats); // for chat

// get single room
router
  .route('/:roomId')
  .get(
    authorization,
    authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(joiSchema.getRoom),
    roomCtrl.getRoom,
  );

module.exports = router;
