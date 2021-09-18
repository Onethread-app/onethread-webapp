const express = require('express');

const router = express.Router();
const passport = require('passport');

// const authorization = passport.authenticate('jwt', { session: false });
const { authorization } = require('../middlewares/authorizationMiddleware');
const joiSchema = require('./message.validation');
const messageCtrl = require('./message.controller');
const SchemaValidator = require('../helpers/joiSchemaValidator');

router
  .route('/search/room/:roomId')
  .get(authorization, messageCtrl.searchMessage);

router
  .route('/unread-messages')
  .get(authorization, messageCtrl.unreadMessageCounts);

router
  .route('/')
  .post(authorization, SchemaValidator(joiSchema.create), messageCtrl.create);

router
  .route('/:messageId/discussion')
  .put(
    authorization,
    SchemaValidator(joiSchema.toggleDiscussion),
    messageCtrl.toggleDiscussion,
  );

router
  .route('/room/:roomId')
  .get(
    authorization,
    SchemaValidator(joiSchema.getRoomMessages),
    messageCtrl.getRoomMessages,
  );

router
  .route('/room/:roomId/files')
  .get(
    authorization,
    SchemaValidator(joiSchema.getRoomFiles),
    messageCtrl.getRoomFiles,
  );

router
  .route('/room/:roomId/discussion')
  .get(
    authorization,
    SchemaValidator(joiSchema.getRoomDiscussion),
    messageCtrl.getRoomDiscussion,
  );

module.exports = router;
