const express = require('express');
const boardCtrl = require('./board.controller');
const passport = require('passport');
const joiSchema = require('./board.validation');
const SchemaValidator = require('./../helpers/joiSchemaValidator');

// const authorization = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const { permit, authSelf } = require('./../helpers/permission');

const router = express.Router();


router
  .route('/')
  
  .post(
    authorization,
    // permit('user', 'admin'),
    SchemaValidator(joiSchema.createBoard),
    boardCtrl.create,
  );

  router
  .route('/boardProject/:projectId')
  .get(
    authorization,
    // permit('user', 'admin'),
    boardCtrl.list,
  )

// get specific board details
router
  .route('/:boardId')
  .get(
    authorization,
    // permit('user', 'admin'),
    boardCtrl.get,
  )
  .put(
    authorization,
    // permit('user', 'admin'),
    boardCtrl.update,
  );

router
  .route('/:boardId/members')
  .put(authorization, boardCtrl.addBoardMembers);

router
  .route('/:boardId/columns')
  .put(authorization, boardCtrl.addBoardColumn);

router
  .route('/:boardId/suggest-member')
  .get(authorization, boardCtrl.suggestMember);

router.param('boardId', boardCtrl.load);

module.exports = router;
