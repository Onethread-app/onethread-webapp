const express = require('express');

const router = express.Router();
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const utilsCtrl = require('./utils.controller');

router.route('/email-checker').post(utilsCtrl.EmailIDExist);
router.route('/change-username').put(requireAuth, utilsCtrl.changeUserName);
module.exports = router;
