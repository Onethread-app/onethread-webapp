const express = require('express');
const associateCtrl = require('./associate.controller');
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
  .route('/')
  .get(
    authorization,
    associateCtrl.list,
  )
  .post(
    authorization,
    SchemaValidator(joiSchema.createAssociate),
    associateCtrl.create,
  );

  router
  .route('/:boardId')
  .get(
    authorization,
    associateCtrl.get,
  )

//router.param('boardId', boardCtrl.load);

module.exports = router;
