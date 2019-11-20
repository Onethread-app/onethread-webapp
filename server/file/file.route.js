const express = require('express');
const multer = require('multer');
const router = express.Router();
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });

// Multer ships with storage engines DiskStorage and MemoryStorage
// And Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileCtrl = require('./file.controller');

router.post(
  '/upload',
  upload.single('file'),
  requireAuth,
  fileCtrl.fileUpload,
);

router.get('/show-file', fileCtrl.displayFile);

module.exports = router;
