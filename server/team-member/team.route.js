const express = require('express');
const router = express.Router();
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');
const teamValidation = require('./team.validation');
const teamCtrl = require('./team.controller');

const SchemaValidator = require('../helpers/joiSchemaValidator');

router
  .route('/:companyId/search')
  .get(authorization, teamCtrl.searchTeamMember);

router.route('/:companyId/add-team-member').post(
  authorization,
  // TODO: member validations
  // SchemaValidator(joiSchema.newMember),
  teamCtrl.addTeamMember,
);
// .get(authorization, teamCtrl.list);

router
  .route('/:memberId')
  .get(
    authorization,
    SchemaValidator(teamValidation.getMember),
    teamCtrl.getMember,
  );

// router
//   .route('/:memberId/changeRole')
//   .put(
//     authorization,
//     SchemaValidator(teamValidation.changeRole),
//     memberCtrl.changeRole,
//   );

// router.param('memberId', memberCtrl.getMemberLoad);

module.exports = router;
