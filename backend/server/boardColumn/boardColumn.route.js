const express = require('express');
const boardColumnCtrl = require('./boardColumn.controller');
const SchemaValidator = require('./../helpers/joiSchemaValidator');
const joiSchema = require('./boardColumn.validation');

// const authorization = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

const router = express.Router();
const {
  subscriptionExpireCheck,
} = require('../subscription/subscription.controller');
router.use('/', subscriptionExpireCheck);
router
  .route('/')
  .get(
    authorization,
    // permit('user', 'admin'),
    boardColumnCtrl.list,
  )
  .post(
    authorization,
    // permit('user', 'admin'),
    SchemaValidator(joiSchema.createBoardColumn),
    boardColumnCtrl.create,
  );

router.route('/:boardColumnId').put(
  authorization,
  // permit('user', 'admin'),
  SchemaValidator(joiSchema.updateBoardColumn),
  boardColumnCtrl.update,
);

router.param('boardColumnId', boardColumnCtrl.load);

module.exports = router;
