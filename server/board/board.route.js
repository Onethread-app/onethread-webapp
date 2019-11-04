const express = require('express');
const boardCtrl = require('./board.controller');
const passport = require('passport');
const joiSchema = require('./board.validation');
const SchemaValidator = require('./../helpers/joiSchemaValidator');

const requireAuth = passport.authenticate('jwt', { session: false });
const { permit, authSelf } = require('./../helpers/permission');

const router = express.Router();

// get borad list
router.route('/')
  .get(requireAuth, permit('user', 'admin'), boardCtrl.list)
  .post(
    requireAuth, 
    permit('user', 'admin'),
    SchemaValidator(joiSchema.createBoard), 
    boardCtrl.create);

// get specific board details
router.route('/:boardId')
    .get(requireAuth, permit('user', 'admin'), boardCtrl.get)
    .put(requireAuth, permit('user', 'admin'), boardCtrl.update);

router.route('/:boardId/members')
    .put(requireAuth, boardCtrl.addBoardMembers);

router.route('/:boardId/columns')
    .put(requireAuth, boardCtrl.addBoardColumn);

router.param('boardId', boardCtrl.load);

module.exports = router;