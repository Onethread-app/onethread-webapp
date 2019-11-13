const express = require('express');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });

const fileCtrl = require('./file.controller');

router.get('/upload', requireAuth, fileCtrl.fileUpload);

module.exports = router;
