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

router
  .route('/')

  .post(
    authorization,
    subCtrl.subscriptionExpireCheck(),
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
    subCtrl.subscriptionExpireCheck(),
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
<<<<<<< HEAD
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
=======
    // projectCtrl.authorizeProjectRole(
    //   'all',
    //   'admin',
    //   'projectModerator',
    //   'member',
    // ),
>>>>>>> 6d92f22e... Dev (#202)
    SchemaValidator(boardSchema.singleBoard),
    boardCtrl.get,
  )
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    boardCtrl.update,
  );

router
  .route('/:boardId/members')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
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
    subCtrl.subscriptionExpireCheck(),
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
    subCtrl.subscriptionExpireCheck(),
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
