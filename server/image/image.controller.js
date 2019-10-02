const AWS = require('aws-sdk');
const config = require('../../config/config');
const logger = require('../../config/winston');
const Image = require('./image.model');

const imageUpload = async (req, res, next) => {
  const reqData = req.body;
  const reqFile = req.file;
  const imageName = new Date().getTime() + reqFile.originalname;
  //TODOS: need to configure later
  const s3FileURL = process.env.AWS_UPLOADED_FILE_URL_LINK;
  AWS.config.update({
    accessKeyId: config.awsAccessKey,
    secretAccessKey: config.awsSecretAccessKey,
    region: config.s3Region,
  });
  let s3bucket = new AWS.S3();
  let params = {
    Bucket: 'tigrow',
    Key: imageName,
    Body: reqFile.buffer,
    ContentType: reqFile.mimetype,
    ACL: 'public-read',
  };

  s3bucket
    .upload(params)
    .promise()
    .then(data => {
      const newImage = new Image({
        photoURL: s3FileURL + reqFile.originalname,
        s3_key: params.Key,
      });
      newImage.save((err, post) => {
        if (err) {
          return logger.error(`HEY ${err}`);
        }
        logger.info('Image uploaded to s3 successfully');
        return res.json({ msg: 'successful' });
      });
    })
    .catch(err => {
      logger.error(`HEY ${err}`);
      return res.send('HEY ' + err);
    });
};

module.exports = { imageUpload };
