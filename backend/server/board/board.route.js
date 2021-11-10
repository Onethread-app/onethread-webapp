const express = require('express');
const boardCtrl = require('./board.controller');
const projectCtrl = require('../project/project.controller');
const boardSchema = require('./board.validation');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
const subCtrl = require('../middlewares/subscriptionCheckerMiddleware');

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
    SchemaValidator(boardSchema.createBoard),
    boardCtrl.create,
  );

router.route('/update').post(
  authorization,
  // projectCtrl.authorizeProjectRole(
  //   'all',
  //   'admin',
  //   'projectModerator',
  //   'member',
  // ),
  SchemaValidator(boardSchema.updateFields),
  boardCtrl.updateBoard,
);

router.route('/delete').post(
  authorization,
  // projectCtrl.authorizeProjectRole(
  //   'all',
  //   'admin',
  //   'projectModerator',
  //   'member',
  // ),
  SchemaValidator(boardSchema.deleteBoard),
  boardCtrl.deleteBoard,
);

router
  .route('/boardProject')
  .get(
    authorization,
    SchemaValidator(boardSchema.listAllBoards),
    boardCtrl.list,
  );

// get specific board details
router
  .route('/:boardId')
  .get(
    authorization,
    SchemaValidator(boardSchema.singleBoard),
    boardCtrl.get,
  );

router
  .route('/:boardId/update-name')
  .put(
    authorization,
    SchemaValidator(boardSchema.updateName),
    boardCtrl.updateName,
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
