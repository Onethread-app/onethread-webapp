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
<<<<<<< HEAD
<<<<<<< HEAD
const subCtrl = require('../subscription/subscription.controller');

=======
const {
  subscriptionExpireCheck,
} = require('../subscription/subscription.controller');
router.use('/', subscriptionExpireCheck);
>>>>>>> 3a98ae02... Wip/tig 229 (#232)
=======
const subCtrl = require('../subscription/subscription.controller');

>>>>>>> 1d9824de... Bugfix/controller (#259)
router
  .route('/')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    boardColumnCtrl.list,
  )
  .post(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(joiSchema.createBoardColumn),
    boardColumnCtrl.create,
  );

router
  .route('/:boardColumnId')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    projectCtrl.authorizeProjectRole(
      'all',
      'admin',
      'projectModerator',
      'member',
    ),
    SchemaValidator(joiSchema.updateBoardColumn),
    boardColumnCtrl.update,
  );

router.param('boardColumnId', boardColumnCtrl.load);

module.exports = router;
