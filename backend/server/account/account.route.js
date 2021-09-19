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
  .route('/invite-signup')
  .post(
    schemaValidator(paramValidation.inviteSignup),
    accountCtrl.inviteSignup,
  );

router
  .route('/resend-email')
  .post(
    schemaValidator(paramValidation.resendEmail),
    accountCtrl.resendEmail,
  );

router
  .route('/verify-account/:token')
  .get(
    schemaValidator(paramValidation.getAccessTokenForVerifyAccount),
    accountCtrl.getAccessTokenForVerifyAccount,
  );

router
  .route('/update')
  .put(
    authorization,
    schemaValidator(paramValidation.update),
    accountCtrl.accountUpdate,
  );

// authentication
router
  .route('/signup')
  .post(
    schemaValidator(paramValidation.register),
    accountCtrl.register,
  );

router
  .route('/login')
  .post(
    authentication,
    schemaValidator(paramValidation.login),
    accountCtrl.login,
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
router.route('/due-task').get(authorization, accountCtrl.userDueTask);
router
  .route('/daily-progress')
  .get(authorization, accountCtrl.userDailyProgress);
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
