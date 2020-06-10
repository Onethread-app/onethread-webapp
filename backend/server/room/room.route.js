const express = require('express');
// const authorization = passport.authenticate('jwt', { session: false });
const {authorization} = require('../middlewares/authorizationMiddleware');
const joiSchema = require('./room.validation');
const roomCtrl = require('./room.controller');
const projectCtrl = require('../project/project.controller');
const SchemaValidator = require('../helpers/joiSchemaValidator');

const router = express.Router();

// create a room for a company
router
    .route('/')
    .post(
        authorization,
        projectCtrl.authorizeProjectRole(
            'all',
            'admin',
            'projectModerator',
            'member',
        ),
        SchemaValidator(joiSchema.createRoom),
        roomCtrl.create,
    );

router
    .route('/:roomId/archive')
    .put(
        authorization,
        SchemaValidator(joiSchema.archiveRoom),
        roomCtrl.archiveRoom,
    );

// get members for a room
router.route('/members/:roomId').get(authorization, roomCtrl.memberList);

// update last seen for member in a room
router
    .route('/last-seen/:roomId')
    .put(
        authorization,
        SchemaValidator(joiSchema.updateLastSeen),
        roomCtrl.updateLastSeen,
    );

// add user into a company's room
router
    .route('/addUser')
    .post(
        authorization,
        SchemaValidator(joiSchema.addMembers),
        roomCtrl.addMembers,
    );

// get suggestions for adding members
router.route('/suggest-member').get(authorization, roomCtrl.suggestMember);

router.route('/list/:company').get(authorization, roomCtrl.listCompany);

router.route('/list/:company').get(authorization, roomCtrl.listCompany);

router.route('/list/:company').get(authorization, roomCtrl.listCompany);

// get rooms for a company
router.route('/:company/:project').get(authorization, roomCtrl.list);

// get single room
router
    .route('/:roomId')
    .get(
        authorization,
        projectCtrl.authorizeProjectRole(
            'all',
            'admin',
            'projectModerator',
            'member',
        ),
        SchemaValidator(joiSchema.getRoom),
        roomCtrl.getRoom,
    );

module.exports = router;
