const express = require('express');
const associateCtrl = require('./associate.controller');
const companyCtrl = require('../company/company.controller');
const passport = require('passport');
const joiSchema = require('./associate.validation');
const SchemaValidator = require('./../helpers/joiSchemaValidator');


const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const { permit, authSelf } = require('./../helpers/permission');

const router = express.Router();

// get borad list
  router
  .route('/:companyId') //companyId for authorization
  .post(
    authorization,
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    SchemaValidator(joiSchema.createAssociate),
    associateCtrl.createPending,
  )
  .get(
    authorization,
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    associateCtrl.list,
  );

  router
  .route('/pending/:companyId')
  .get(
    authorization,
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    associateCtrl.listPending,
  );

  router
  .route('/accept/:companyId')
  .post(
    authorization,
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    associateCtrl.acceptPending,
  )
  
  router
  .route('/reject/:companyId')
  .post(
    authorization,
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    associateCtrl.rejectPending,
  )

  router
  .route('/:associateId/:companyId')
  .get(
    authorization,
    companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
    associateCtrl.get,
  )

//router.param('boardId', boardCtrl.load);

module.exports = router;
