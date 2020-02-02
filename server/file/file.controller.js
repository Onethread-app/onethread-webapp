const AWS = require('aws-sdk');
const config = require('../../config/config');
const logger = require('../../config/winston');
const { sendJSONresponse } = require('../helpers/jsonResponse');
const File = require('./file.model');
const Account = require('../account/account.model');
const { Company } = require('../company/company.model');
const { Room } = require('../room/room.model');
const { generateGetUrl } = require('../services/s3');
let s3bucket = new AWS.S3({
  accessKeyId: config.awsAccessKey,
  secretAccessKey: config.awsSecretAccessKey,
  region: config.s3Region,
});
const profilePicture = async (req, res, next) => {
  const file = req.file;
  const userID = req.user._id;
  const params = {
    Bucket: 'tigrow-file',
    Key: `${userID}/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };
  await s3bucket
    .upload(params)
    .promise()
    .then(async data => {
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
        .then(async data => {
          logger.info('File Link successfully save to Database');
          if (userID) {
            const account = await Account.findOne({
              _id: userID,
            }).select('profileImage coverImage');
            if (data.imageType === 'profilePic') {
              account.profileImage = data._id;
            }
            if (data.imageType === 'coverPhoto') {
              account.coverImage = data._id;
            }
            await account.save();
            return sendJSONresponse(res, 200, data);
          }
        })
        .catch(error => {
          logger.error(`${error}`);
          next(error);
        });
    })
    .catch(err => {
      next(err);
    });
};

const displayProPic = async (req, res, next) => {
  const { Key } = req.query;
  generateGetUrl(Key)
    .then(getURL => {
      return sendJSONresponse(res, 200, getURL);
    })
    .catch(err => {
      next(err);
    });
};

const companyLogo = async (req, res, next) => {
  const file = req.file;
  const userID = req.user._id;
  const companyID = req.query.cid;
  const params = {
    Bucket: 'tigrow-file',
    Key: `${companyID}/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };
  await s3bucket
    .upload(params)
    .promise()
    .then(async data => {
      logger.info(`Company Logo Successfully upload to S3`);
      const newFile = {
        link: data.Location,
        s3Key: data.Key,
        // company: companyID,
        type: params.ContentType,
        account: userID,
      };
      const file = new File(newFile);
      file
        .save()
        .then(async data => {
          logger.info('File Link successfully save to Database');
          const company = await Company.findOne({
            _id: companyID,
          });
          company.logo = data._id;
          company.save();
          return sendJSONresponse(res, 200, data);
        })
        .catch(error => {
          logger.error(`${error}`);
          next(error);
        });
    })
    .catch(err => {
      next(err);
    });
};

const fileInRooms = async (req, res, next) => {
  const file = req.file;
  const roomID = req.query.roomID;
  const userID = req.user._id;
  const params = {
    Bucket: 'tigrow-file',
    Key: `${roomID}/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };
  await s3bucket
    .upload(params)
    .promise()
    .then(async data => {
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

        const room = await Room.findOne({ _id: roomID });
        logger.info(room);

        room.file.push(newFile._id);
        await room.save();
        logger.info('File ref successfully save to room collection');

        logger.info(newFile);
        return sendJSONresponse(res, 200, { data, newFile });
      } catch (error) {
        logger.error(`${error}`);
        next(error);
      }
    })
    .catch(err => {
      next(err);
    });
};
module.exports = {
  profilePicture,
  displayProPic,
  companyLogo,
  fileInRooms,
};
