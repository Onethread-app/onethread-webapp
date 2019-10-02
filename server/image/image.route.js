const express = require('express');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', {
  session: false,
});

const multer = require('multer');
const storage = multer.memoryStorage();
const uploadx = multer({ storage: storage });
const imageCtrl = require('./image.controller');

router.post(
  '/',
  requireAuth,
  uploadx.single('image'),
  imageCtrl.imageUpload,
);

module.exports = router;
