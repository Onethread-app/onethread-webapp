const express = require('express');
const passport = require('passport');
const boardColumnCtrl = require('./boardColumn.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
const joiSchema = require('./boardColumn.validation');

const requireAuth = passport.authenticate('jwt', { session: false });
const { permit } = require('./../helpers/permission');

const router = express.Router();

router
  .route('/')
  .get(requireAuth, permit('user', 'admin'), boardColumnCtrl.list)
  .post(
    requireAuth,
    permit('user', 'admin'),
    SchemaValidator(joiSchema.createBoardColumn),
    boardColumnCtrl.create,
  );

router
  .route('/:boardColumnId')
  .put(
    requireAuth,
    permit('user', 'admin'),
    SchemaValidator(joiSchema.updateBoardColumn),
    boardColumnCtrl.update,
  );

router.param('boardColumnId', boardColumnCtrl.load);

module.exports = router;
