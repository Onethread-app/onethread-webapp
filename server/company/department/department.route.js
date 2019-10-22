const express = require('express');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const deptCtrl = require('./department.controller.js');

router.route('/').post(requireAuth, deptCtrl.newDept);
router.route('/').get(requireAuth, deptCtrl.deptList);

//
//router.route('/search').get(requireAuth, skillCtrl.searchSkillSet);
//router.param('id', skillCtrl.skillLoad);

module.exports = router;
