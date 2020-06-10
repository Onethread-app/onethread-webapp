const express = require('express');
const passport = require('passport');
const taskCtrl = require('./task.controller');
const SchemaValidator = require('../helpers/joiSchemaValidator');
const joiSchema = require('./task.validation');

// const authorization = passport.authenticate('jwt', { session: false });
const {authorization} = require('../middlewares/authorizationMiddleware');
const {permit} = require('../helpers/permission');

const router = express.Router();

router
	.route('/')
	.get(
		authorization,
		// permit('user', 'admin'),
		taskCtrl.list,
	)
	.post(
		authorization,
		// permit('user', 'admin'),
		SchemaValidator(joiSchema.createTask),
		taskCtrl.create,
	);

router
	.route('/:taskId')
	.get(
		authorization,
		// permit('user', 'admin'),
		taskCtrl.get,
	)
	.put(
		authorization,
		// permit('user', 'admin'),
		SchemaValidator(joiSchema.updateTask),
		taskCtrl.update,
	);

router
	.route('/member/:taskId')
	.get(authorization, taskCtrl.getMembers)
	.post(authorization, SchemaValidator(joiSchema.addMember), taskCtrl.addMember)
	.delete(
		authorization,
		SchemaValidator(joiSchema.deleteMember),
		taskCtrl.deleteMember,
	);

router.route('/dragTask').post(
	authorization,
	// permit('user', 'admin'),
	SchemaValidator(joiSchema.dragTask),
	taskCtrl.dragTask,
);

router
	.route('/:taskId/suggest-member')
	.get(authorization, taskCtrl.suggestMember);

router.param('taskId', taskCtrl.load);

module.exports = router;
