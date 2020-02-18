const express = require('express');
const router = express.Router();
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const joiSchema = require('./project.validation');
const SchemaValidator = require('../helpers/joiSchemaValidator');

const projectCtrl = require('./project.controller');

// create project
router
  .route('/')
  .post(
    authorization,
    SchemaValidator(joiSchema.create),
    projectCtrl.create,
  );

module.exports = router;
