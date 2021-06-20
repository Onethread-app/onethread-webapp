const express = require('express');
const boardCtrl = require('./board.controller');
const projectCtrl = require('../project/project.controller');
const boardSchema = require('./board.validation');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
const subCtrl = require('../subscription/subscription.controller');

// const authorization = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

const router = express.Router();

router.use('/', subCtrl.subscriptionExpireCheck());

router
  .route('/')

  .post(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(boardSchema.createBoard),
    boardCtrl.create,
  );

router
  .route('/boardProject')
  .get(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(boardSchema.listAllBoards),
    boardCtrl.list,
  );

// get specific board details
router
  .route('/:boardId')
  .get(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(boardSchema.singleBoard),
    boardCtrl.get,
  );

router
  .route('/:boardId/update-name')
  .put(
    authorization,
    projectCtrl.authorizeProjectRole('admin', 'projectModerator'),
    SchemaValidator(boardSchema.updateName),
    boardCtrl.updateName,
  );

router
  .route('/:boardId/members')
  .put(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    boardCtrl.addBoardMembers,
  );

router
  .route('/:boardId/columns')
  .put(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    boardCtrl.addBoardColumn,
  );

router
  .route('/:boardId/suggest-member')
  .get(
    authorization,
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    boardCtrl.suggestMember,
  );

router.param('boardId', boardCtrl.load);

module.exports = router;
