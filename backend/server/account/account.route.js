const express = require('express');
const passportService = require('../services/passport.services');
const paramValidation = require('./account.validation');
const router = express.Router();

const accountCtrl = require('./account.controller');
const schemaValidator = require('../helpers/joiSchemaValidator');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const {
  authentication,
} = require('../middlewares/authenticationMiddleware');

router
  .route('/signup')
  .post(schemaValidator(paramValidation.signup), accountCtrl.signup);

router
  .route('/init')
  .put(
    schemaValidator(paramValidation.init),
    accountCtrl.registerInitiate,
  );

router
  .route('/update')
  .put(
    authorization,
    schemaValidator(paramValidation.update),
    accountCtrl.accountUpdate,
  );

router
  .route('/login')
  .post(
    authentication,
    schemaValidator(paramValidation.login),
    accountCtrl.login,
  );

router
  .route('/update-email')
  .put(
    schemaValidator(paramValidation.updateEmail),
    accountCtrl.updateEmail,
  );

router
  .route('/resend-email')
  .post(
    schemaValidator(paramValidation.resendEmail),
    accountCtrl.resendEmail,
  );

router
  .route('/change-email')
  .put(
    schemaValidator(paramValidation.changeEmail),
    accountCtrl.changeEmail,
  );

router.route('/').get(authorization, accountCtrl.getAccount);
router.route('/skill-area').get(authorization, accountCtrl.skillArea);
router
  .route('/task-list')
  .get(authorization, accountCtrl.userTaskList);
router
  .route('/subtasks')
  .get(authorization, accountCtrl.userSubtasks);
router
  .route('/:subTaskId/done')
  .put(
    authorization,
    schemaValidator(paramValidation.subTaskMarkAsDone),
    accountCtrl.subtaskMarkAsDone,
  );
router.route('/timeline').get(authorization, accountCtrl.timeline);

router
  .route('/logout')
  .post(
    authorization,
    schemaValidator(paramValidation.logout),
    accountCtrl.logout,
  );
router
  .route('/forget-password')
  .post(accountCtrl.sendEmailForForgetPassword);
router
  .route('/reset-password/')
  .put(
    schemaValidator(paramValidation.resetPassword),
    accountCtrl.resetPassword,
  );
router
  .route('/change-password')
  .put(
    authorization,
    schemaValidator(paramValidation.changePassword),
    accountCtrl.changePassword,
  );
router.route('/refresh').post(accountCtrl.tokenRefresh);

router
  .route('/save-language')
  .post(authorization, accountCtrl.saveLanguage);

// for admin
// router
//   .route('/admin')
//   .post(requireLogin, permit('admin'), accountCtrl.login);

module.exports = router;
