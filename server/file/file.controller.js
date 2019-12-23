const AWS = require('aws-sdk');
const config = require('../../config/config');
const logger = require('../../config/winston');
const { sendJSONresponse } = require('../helpers/jsonResponse');
const File = require('./file.model');
const Account = require('../account/account.model');
const { Company } = require('../company/company.model');
const { Room } = require('../room/room.model');
const { generateGetUrl, generatePutUrl } = require('../services/s3');

const s3FileURL = `https://tigrow-file.s3-ap-southeast-1.amazonaws.com/`;
let s3bucket = new AWS.S3({
  accessKeyId: config.awsAccessKey,
  secretAccessKey: config.awsSecretAccessKey,
  region: config.s3Region,
});

const profilePicture = async (req, res, next) => {
  const file = req.file;
  const userID = req.user._id;
  const accountId = await Account.findOne({ _id: userID });
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
        link: s3FileURL + params.Bucket,
        s3Key: params.Key,
        account: req.user._id,
        type: params.ContentType,
      };
      const file = new File(newFile);
      file
        .save()
        .then(async data => {
          logger.info('File Link successfully save to Database');
          if (userID) {
            const account = await Account.findOne({
              _id: userID,
            }).select('profileImage');
            account.profileImage = data._id;
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
        link: s3FileURL + params.Bucket,
        s3Key: params.Key,
        company: companyID,
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
      logger.info(`File in rooms Successfully upload to S3`);
      const newFile = {
        link: s3FileURL + params.Bucket,
        s3Key: params.Key,
        company: companyID,
        type: params.ContentType,
        account: userID,
        room: roomID,
      };
      const file = new File(newFile);
      file
        .save()
        .then(async data => {
          logger.info('File Link successfully save to Database');
          const room = await Room.findOne({
            _id: roomID,
          }).select('files');
          room.files.push(data._id);
          await room.save();
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
module.exports = {
  profilePicture,
  displayProPic,
  companyLogo,
  fileInRooms,
};
