const express = require('express');

const router = express.Router();
const {authorization} = require('../../middlewares/authorizationMiddleware');
const joiSchema = require('./member.validation');
const memberCtrl = require('./member.controller');

const SchemaValidator = require('../../helpers/joiSchemaValidator');

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

router.route('/pending').get(authorization, memberCtrl.pendingList);

router
	.route('/pending/status')
	.get(
		authorization,
		SchemaValidator(joiSchema.checkInvitedMemberStatus),
		memberCtrl.checkInvitedMemberStatus,
	);

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

router.param('memberId', memberCtrl.getMemberLoad);

module.exports = router;
