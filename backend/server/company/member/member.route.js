const express = require('express');
const router = express.Router();
const {
  authorization,
} = require('../../middlewares/authorizationMiddleware');
const subCtrl = require('../../subscription/subscription.controller');
const joiSchema = require('./member.validation');
const memberCtrl = require('./member.controller');
const { authorizeUser } = require('../company.controller');

const SchemaValidator = require('../../helpers/joiSchemaValidator');

router.use('/', subCtrl.subscriptionExpireCheck());

router.route('/search').get(authorization, memberCtrl.searchMember);

router
  .route('/')
  .post(
    authorization,
    // TODO: member validations
    // SchemaValidator(joiSchema.newMember),
    memberCtrl.addMember,
  )
  .get(authorization, memberCtrl.list);

router.route('/bulk').post(
  authorization,
  // TODO: member validations
  SchemaValidator(joiSchema.bulkMember),
  memberCtrl.bulkInsertMember,
);

router.route('/pending').get(authorization, memberCtrl.pendingList);

router
  .route('/pending/status')
  .get(
    authorization,
    SchemaValidator(joiSchema.checkInvitedMemberStatus),
    memberCtrl.checkInvitedMemberStatus,
  );

router.route('/join-request').post(memberCtrl.sendJoinRequest);

router
  .route('/accept-request')
  .post(authorization, memberCtrl.acceptJoinRequest);

router
  .route('/:memberId')
  .get(
    authorization,
    SchemaValidator(joiSchema.getMember),
    memberCtrl.getMember,
  )
  .delete(
    authorization,
    SchemaValidator(joiSchema.deleteMember),
    memberCtrl.deleteMember,
  );

router
  .route('/:memberId/changeRole')
  .put(
    authorization,
    SchemaValidator(joiSchema.changeRole),
    memberCtrl.changeRole,
  );

router
  .route('/join-request')
  .post(authorization, memberCtrl.sendJoinRequest);

router
  .route('/:memberId/accept-request')
  .post(
    authorization,
    SchemaValidator(joiSchema.acceptJoinRequest),
    authorizeUser('all', 'admin', 'superAdmin'),
    memberCtrl.acceptJoinRequest,
  );

router.param('memberId', memberCtrl.getMemberLoad);

module.exports = router;
