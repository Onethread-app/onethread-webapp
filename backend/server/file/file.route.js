const express = require('express');
const multer = require('multer');
const fileValidation = require('./file.validation');
const router = express.Router();
const schemaValidator = require('../helpers/joiSchemaValidator');
const {
  authorization,
} = require('../middlewares/authorizationMiddleware');

// Multer ships with storage engines DiskStorage and MemoryStorage
// And Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileCtrl = require('./file.controller');

router.post(
  '/upload',
  upload.single('file'),
  authorization,
  fileCtrl.profilePicture,
);

// router.get('/show-file', fileCtrl.displayProPic);
router.post(
  '/:companyId/upload',
  upload.single('file'),
  authorization,
  fileCtrl.companyLogo,
);
router.post(
  '/file-upload-room',
  upload.single('file'),
  authorization,
  fileCtrl.fileInRooms,
);
router.post(
  '/file-upload-project',
  upload.single('file'),
  authorization,
  schemaValidator(fileValidation.fileInProject),
  fileCtrl.fileInProject,
);
router
.put(
  '/file-upload-task',
upload.single('file'),
authorization,
schemaValidator(fileValidation.fileInTask),
fileCtrl.fileInTask,
);

router
.put(
  '/file-delete-task',
authorization,
schemaValidator(fileValidation.fileDeleteInTask),
fileCtrl.removeFileInTask,
);
module.exports = router;
