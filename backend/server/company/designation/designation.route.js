const express = require('express');

const router = express.Router();
const passport = require('passport');
const {authorization} = require('../../middlewares/authorizationMiddleware');
const designationCtrl = require('./designation.controller');
const joiSchema = require('./designation.validation');
const SchemaValidator = require('../../helpers/joiSchemaValidator');

router
    .route('/:memberId')
    .post(
        authorization,
        SchemaValidator(joiSchema.create),
        designationCtrl.create,
    )
    .put(authorization, SchemaValidator(joiSchema.edit), designationCtrl.edit)
    .get(authorization, SchemaValidator(joiSchema.list), designationCtrl.list);

router.param('memberId', designationCtrl.load);

module.exports = router;
