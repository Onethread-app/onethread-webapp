const express = require('express');
const boardColumnCtrl = require('./boardColumn.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
const joiSchema = require('./boardColumn.validation');
const projectCtrl = require('../project/project.controller');
// const authorization = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

const router = express.Router();
const subCtrl = require('../middlewares/subscriptionCheckerMiddleware');

router
  .route('/')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    boardColumnCtrl.list,
  )
  .post(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    SchemaValidator(joiSchema.createBoardColumn),
    boardColumnCtrl.create,
  );

router
  .route('/:boardColumnId')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    SchemaValidator(joiSchema.updateBoardColumn),
    boardColumnCtrl.update,
  );

router.param('boardColumnId', boardColumnCtrl.load);

module.exports = router;
