const express = require('express');
const router = express.Router();
const passport = require('passport');
// const authorization = passport.authenticate('jwt', { session: false });
const {
  authorization,
} = require('../../middlewares/authorizationMiddleware');
const deptCtrl = require('./department.controller.js');
const joiSchema = require('./department.validation');
const SchemaValidator = require('../../helpers/joiSchemaValidator');

router
  .route('/')
  .post(
    authorization,
    SchemaValidator(joiSchema.create),
    deptCtrl.create,
  )
  .get(authorization, deptCtrl.list);

module.exports = router;
