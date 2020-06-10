const express = require('express');
const projectValidation = require('./project.validation');

const router = express.Router();

const schemaValidator = require('../helpers/joiSchemaValidator');
const projectCtrl = require('./project.controller');
const companyCtrl = require('../company/company.controller');
const {authorization} = require('../middlewares/authorizationMiddleware');

router
    .route('/change-title')
    .put(
        authorization,
        schemaValidator(projectValidation.changeNameProject),
        projectCtrl.authorizeProjectRole('all', 'admin', 'projectModerator'),
        projectCtrl.changeTitleProject,
    );
// authentication
router
    .route('/:companyId/create')
    .post(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        schemaValidator(projectValidation.createNewProjectForCompany),
        projectCtrl.createNewProjectForCompany,
    );

router
    .route('/:companyId/add-associates')
    .put(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        projectCtrl.authorizeProjectRole('all', 'admin'),
        schemaValidator(projectValidation.addAssociate),
        projectCtrl.addAssociateInProject,
    );
router
    .route('/:companyId/lists')
    .get(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin', 'employee'),
        schemaValidator(projectValidation.showProjectList),
        projectCtrl.showAllProjectsForCompany,
    );

router
    .route('/concern-admin-search/:companyId')
    .get(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        schemaValidator(projectValidation.searchConcernAdmin),
        projectCtrl.suggestConcernAdmin,
    );

router
    .route('/associate-company-search/:companyId')
    .get(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        schemaValidator(projectValidation.searchAssociateCompany),
        projectCtrl.suggestAssociateCompany,
    );
router
    .route('/:companyId/archive-list')
    .get(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        schemaValidator(projectValidation.showProjectList),
        projectCtrl.archiveProjectList,
    );
router
    .route('/:companyId/pending-requests')
    .get(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        schemaValidator(projectValidation.pendingList),
        projectCtrl.projectPendingRequest,
    );
router
    .route('/:companyId/accept-request')
    .put(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        schemaValidator(projectValidation.acceptProject),
        projectCtrl.acceptProjectRequest,
    );
router
    .route('/:companyId/reject-request')
    .put(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        schemaValidator(projectValidation.rejectProject),
        projectCtrl.rejectProjectRequest,
    );
router
    .route('/')
    .get(
        authorization,
        projectCtrl.authorizeProjectRole(
            'all',
            'admin',
            'projectModerator',
            'member',
        ),
        projectCtrl.getProjectDetails,
    );
router
    .route('/outline')
    .put(
        authorization,
        projectCtrl.authorizeProjectRole('all', 'admin', 'projectModerator'),
        schemaValidator(projectValidation.updateProjectOutline),
        projectCtrl.updateProjectOutline,
    );

router
    .route('/description')
    .put(
        authorization,
        projectCtrl.authorizeProjectRole('all', 'admin', 'projectModerator'),
        schemaValidator(projectValidation.updateProjectDescription),
        projectCtrl.updateProjectDescription,
    );
router
    .route('/show-files')
    .get(
        authorization,
        projectCtrl.authorizeProjectRole(
            'all',
            'admin',
            'projectModerator',
            'member',
        ),
        schemaValidator(projectValidation.getProject),
        projectCtrl.showAllFilesForProject,
    );
router
    .route('/archive')
    .put(
        authorization,
        projectCtrl.authorizeProjectRole('all', 'admin', 'projectModerator'),
        schemaValidator(projectValidation.archiveProject),
        projectCtrl.archiveProject,
    );
router
    .route('/:companyId/role')
    .put(
        authorization,
        companyCtrl.authorizeUser('all', 'admin', 'superAdmin'),
        projectCtrl.updateRole,
    );
router
    .route('/individual/:account')
    .get(authorization, projectCtrl.getProjectIndividual);
module.exports = router;
