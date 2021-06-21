const AWS = require('aws-sdk');
const config = require('../../config/config');
const logger = require('../../config/winston');
const {
  sendJSONresponse,
  sendErrorResponse,
} = require('../helpers/jsonResponse');
const File = require('./file.model');
const Account = require('../account/account.model');
const { Company } = require('../company/company.model');
const { Project } = require('../project/project.model');
const Task = require('../task/task.model');
let s3bucket = new AWS.S3({
  accessKeyId: config.awsAccessKey,
  secretAccessKey: config.awsSecretAccessKey,
  region: config.s3Region,
});
const fileName = (userID, name) => {
  return userID + '_' + Date.now() + '_' + name;
};

const checkMimetype = [
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'application/x-zip-compressed',
  'application/pdf',
  'application/msword',
  'application/json',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/plain',
  'text/csv',
  'image/webp',
  'image/apng',
  'image/png',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/jpg',
  'image/svg',
  'image/svg+xml',
  'image/bmp',
  'image/vnd.microsoft.icon',
];

const profilePicture = async (req, res, next) => {
  const file = req.file;
  const userID = req.user._id;
  const fileRename = fileName(userID, file.originalname);
  const params = {
    Bucket: config.bucketName,
    Key: `${userID}/${fileRename}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };
  await s3bucket
    .upload(params)
    .promise()
    .then(async (data) => {
      logger.info(`File Successfully upload to S3`);
      const newFile = {
        link: data.Location,
        s3Key: data.Key,
        account: userID,
        type: params.ContentType,
        imageType: req.query.imageType,
      };
      const file = new File(newFile);
      file
        .save()
        .then(async (data) => {
          logger.info('File Link successfully save to Database');
          if (userID) {
            if (data.imageType === 'profilePic') {
              await Account.findOneAndUpdate(
                {
                  _id: userID,
                },
                {
                  $set: { profileImage: data.link },
                },
                {
                  new: true,
                  upsert: true,
                },
              );
            }
            if (data.imageType === 'coverPhoto') {
              await Account.findOneAndUpdate(
                {
                  _id: userID,
                },
                {
                  $set: { coverImage: data.link },
                },
                {
                  new: true,
                  upsert: true,
                },
              );
            }
            return sendJSONresponse(res, 200, data);
          }
        })
        .catch((error) => {
          logger.error(`File: ${error}`);
          next(error);
        });
    })
    .catch((err) => {
      logger.error(`File: ${err}`);
      next(err);
    });
};
const companyLogo = async (req, res, next) => {
  const file = req.file;
  const userID = req.user._id;
  const companyID = req.params.companyId;
  const fileRename = fileName(companyID, file.originalname);
  const params = {
    Bucket: config.bucketName,
    Key: `${companyID}/${fileRename}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };
  await s3bucket
    .upload(params)
    .promise()
    .then(async (data) => {
      logger.info(`Company Logo Successfully upload to S3`);
      const newFile = {
        link: data.Location,
        s3Key: data.Key,
        type: params.ContentType,
        account: userID,
        imageType: req.query.imageType,
      };
      const file = new File(newFile);
      file
        .save()
        .then(async (data) => {
          logger.info('File Link successfully save to Database');
          if (data.imageType === 'company-logo') {
            await Company.findOneAndUpdate(
              {
                _id: companyID,
              },
              {
                $set: { logo: data.link },
              },
              {
                new: true,
                upsert: true,
              },
            );

            return sendJSONresponse(res, 200, data);
          }
          if (data.imageType === 'company-cover-photo') {
            await Company.findOneAndUpdate(
              {
                _id: companyID,
              },
              {
                $set: { coverImage: data.link },
              },
              {
                new: true,
                upsert: true,
              },
            );

            return sendJSONresponse(res, 200, data);
          }
        })
        .catch((error) => {
          logger.error(`File: ${error}`);
          next(error);
        });
    })
    .catch((err) => {
      logger.error(`File: ${err}`);
      next(err);
    });
};

const fileInRooms = async (req, res, next) => {
  const file = req.file;
  if (!checkMimetype.includes(file.mimetype)) {
    return sendErrorResponse(res, 400, '', {
      message: 'This file format is not supported',
      fieldName: 'file',
    });
  }
  const roomID = req.query.roomID;
  const userID = req.user._id;
  const params = {
    Bucket: config.bucketName,
    Key: `${roomID}/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };
  await s3bucket
    .upload(params)
    .promise()
    .then(async (data) => {
      logger.info(data);
      try {
        logger.info(`File in rooms Successfully upload to S3`);
        const newFile = new File({
          link: data.Location,
          s3Key: params.Key,
          type: params.ContentType,
          account: userID,
          room: roomID,
        });
        await newFile.save();
        logger.info('File Link successfully save to file collection');

        return sendJSONresponse(res, 200, { newFile });
      } catch (error) {
        logger.error(`${error}`);
        next(error);
      }
    })
    .catch((err) => {
      next(err);
    });
};
const fileInProject = async (req, res, next) => {
  const file = req.file;
  if (!checkMimetype.includes(file.mimetype)) {
    return sendErrorResponse(res, 400, '', {
      message: 'This file format is not supported',
      fieldName: 'file',
    });
  }
  const userID = req.user._id;
  const pid = req.query.pid;
  const pidExist = await Project.findOne({ _id: pid });
  if (pidExist) {
    const params = {
      Bucket: config.bucketName,
      Key: `${pid}/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    await s3bucket
      .upload(params)
      .promise()
      .then(async (data) => {
        logger.info(data);
        try {
          logger.info(`File in project Successfully upload to S3`);
          const newFile = new File({
            link: data.Location,
            s3Key: params.Key,
            type: params.ContentType,
            account: userID,
            project: pid,
          });
          await newFile.save();
          logger.info(
            'File Link successfully save to file collection',
          );
          pidExist.files.push(newFile._id);
          await pidExist.save();
          return sendJSONresponse(res, 200, { newFile });
        } catch (error) {
          logger.error(`${error}`);
          next(error);
        }
      })
      .catch((err) => {
        next(err);
      });
  } else {
    return sendErrorResponse(res, 404, 'ProjectIdNotFoundError', {
      message: 'project id is not exist',
    });
  }
};

const fileInTask = async (req, res, next) => {
  try {
    const file = req.file;
    if (!checkMimetype.includes(file.mimetype)) {
      return sendErrorResponse(res, 400, '', {
        message: 'This file format is not supported',
        fieldName: 'file',
      });
    }
    const userID = req.user._id;
    const tid = req.query.taskId;
    const tidExist = await Task.findById({ _id: tid });
    if (tidExist) {
      const params = {
        Bucket: config.bucketName,
        Key: `${tid}/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };
      await s3bucket
        .upload(params)
        .promise()
        .then(async (data) => {
          logger.info(data);
          try {
            logger.info(`File in project Successfully upload to S3`);
            const newFile = new File({
              link: data.Location,
              s3Key: params.Key,
              type: params.ContentType,
              account: userID,
              task: tid,
            });
            await newFile.save();
            logger.info(
              'File Link successfully save to file collection',
            );
            tidExist.file.push(newFile._id);
            await tidExist.save();
            return sendJSONresponse(res, 200, newFile);
          } catch (error) {
            logger.error(`File: ${error}`);
            next(error);
          }
        })
        .catch((err) => {
          logger.error(`File: ${err}`);
          next(err);
        });
    } else {
      return sendErrorResponse(res, 404, 'TaskIdNotFoundError', {
        message: 'Task id is not exist',
      });
    }
  } catch (error) {
    logger.error(`File: ${error}`);
    next(error);
  }
};

const removeFileInTask = async (req, res, next) => {
  try {
    const { taskId, fileId } = req.body;
    await Task.findByIdAndUpdate(
      { _id: taskId },
      { $pull: { file: { _id: fileId } } },
      { safe: true, new: true, upsert: true },
    );
    await File.findOneAndDelete({ _id: fileId });
    return sendJSONresponse(res, 200, {
      message: `file delete successfully`,
    });
  } catch (error) {
    logger.error(`File: ${error}`);
    next(error);
  }
};
module.exports = {
  profilePicture,
  companyLogo,
  fileInRooms,
  fileInProject,
  fileInTask,
  removeFileInTask,
};
