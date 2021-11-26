const express = require('express');

const schemaValidator = require('../helpers/joiSchemaValidator');
const associateValidation = require('./associate.validation');
const associateCtrl = require('./associate.controller');
const companyCtrl = require('../middlewares/companyRoleMiddleware');

const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

const router = express.Router();
const subCtrl = require('../middlewares/subscriptionCheckerMiddleware');

// get borad list
router
  .route('/') //companyId for authorization
  .post(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    schemaValidator(associateValidation.createAssociate),
    associateCtrl.createPending,
  )
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    associateCtrl.list,
  );

router
  .route('/pending')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    associateCtrl.listPending,
  );

router
  .route('/accept')
  .put(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    schemaValidator(associateValidation.acceptPending),
    associateCtrl.acceptPending,
  );

router
  .route('/reject')
  .delete(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    schemaValidator(associateValidation.rejectPending),
    associateCtrl.rejectPending,
  );

router
  .route('/:associateId')
  .get(
    authorization,
    subCtrl.subscriptionExpireCheck(),
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    associateCtrl.get,
  );

module.exports = router;
