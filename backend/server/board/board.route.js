const express = require('express');
const boardCtrl = require('./board.controller');
const projectCtrl = require('../project/project.controller');
const boardSchema = require('./board.validation');
const SchemaValidator = require('./../helpers/joiSchemaValidator');

// const authorization = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

const router = express.Router();

router
  .route('/')

  .post(
    authorization,
    // permit('user', 'admin'),
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
    // projectCtrl.authorizeProjectRole(
    //   'all',
    //   'admin',
    //   'projectModerator',
    //   'member',
    // ),
    SchemaValidator(boardSchema.singleBoard),
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
