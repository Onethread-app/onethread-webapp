const AWS = require('aws-sdk');
const config = require('../../config/config');
const logger = require('../../config/winston');
const Image = require('./image.model');

const imageUpload = function(reqFile, bucketName, imageName) {
  const s3FileURL = `https://tigrow.s3-ap-southeast-1.amazonaws.com`;
  const folderLink = `${bucketName}/${imageName}`;
  const photoURL = `${s3FileURL}/${folderLink}`;

  AWS.config.update({
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretAccessKey,
    region: config.s3Region,
  });
  const s3bucket = new AWS.S3();
  let params = {
    Bucket: 'tigrow',
    Key: folderLink,
    Body: reqFile.buffer,
    ContentType: reqFile.mimetype,
    ACL: 'public-read',
  };
  s3bucket
    .upload(params)
    .promise()
    .then(async data => {
      const newImage = new Image({
        photoURL: photoURL,
        s3_key: params.Key,
      });
      await newImage.save((err, imageInfo) => {
        if (err) {
          return logger.error(`HEY ${err}`);
        }

        logger.info('Image uploaded to s3 successfully');
        console.log(imageInfo._id);
      });
    })
    .catch(err => {
      logger.error(`HEY ${err}`);
      return err;
    });
  return photoURL;
};

module.exports = { imageUpload };
