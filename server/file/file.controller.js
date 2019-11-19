const AWS = require('aws-sdk');
const config = require('../../config/config');
const logger = require('../../config/winston');
const { sendJSONresponse } = require('../helpers/jsonResponse');
const File = require('./file.model');
const { generateGetUrl, generatePutUrl } = require('../services/s3');

// const fileUpload = function(reqFile, bucketName, imageName) {
//   // const s3FileURL = `https://tigrow.s3-ap-southeast-1.amazonaws.com`;
//   // const folderLink = `${bucketName}/${imageName}`;
//   // const photoURL = `${s3FileURL}/${folderLink}`;
//   // AWS.config.update({
//   //   accessKeyId: config.awsAccessKey,
//   //   secretAccessKey: config.awsSecretAccessKey,
//   //   region: config.s3Region,
//   // });
//   // const s3bucket = new AWS.S3();
//   // let params = {
//   //   Bucket: 'tigrow',
//   //   Key: folderLink,
//   //   Body: reqFile.buffer,
//   //   ContentType: reqFile.mimetype,
//   //   ACL: 'public-read',
//   // };
//   // s3bucket
//   //   .upload(params)
//   //   .promise()
//   //   .then(async data => {
//   //     const newImage = new Image({
//   //       photoURL: photoURL,
//   //       s3_key: params.Key,
//   //     });
//   //     await newImage.save((err, imageInfo) => {
//   //       if (err) {
//   //         return logger.error(`HEY ${err}`);
//   //       }
//   //       logger.info('Image uploaded to s3 successfully');
//   //       console.log(imageInfo._id);
//   //     });
//   //   })
//   //   .catch(err => {
//   //     logger.error(`HEY ${err}`);
//   //     return err;
//   //   });
//   // return photoURL;
// };

// const fileUpload = async (req, res, next) => {
// 	const { Key, ContentType } = req.query;
// 	generatePutUrl(Key, ContentType)
// 		.then(putURL => {
// 			logger.info(`pre-signed url generated for the user`);

// 			return sendJSONresponse(res, 200, putURL);
// 		})
// 		.catch(err => {
// 			next(err);
// 		});
// };

const fileUpload = async (req, res, next) => {
	const file = req.file;
	const userID = req.query.userID;
	const s3FileURL = `https://tigrow-test-1.s3.amazonaws.com/`;
	let s3bucket = new AWS.S3({
		accessKeyId: config.awsAccessKey,
		secretAccessKey: config.awsSecretAccessKey,
		region: config.s3Region,
	});
	const params = {
		Bucket: 'tigrow-test-1',
		Key: file.originalname,
		Body: file.buffer,
		ContentType: file.mimetype,
		ACL: 'public-read',
	};
	s3bucket.upload(params, function(err, data) {
		if (err) {
			return sendJSONresponse(res, 500, { message: err });
		} else {
			logger.info(`File Successfully upload to S3`);
			const newFile = {
				fileLink: s3FileURL + params.Bucket,
				s3_key: params.Key,
				account: userID,
				fileType: params.ContentType,
			};
			const file = new File(newFile);
			file.save(function(error, files) {
				if (error) {
					logger.error(`${error}`);
					next(error);
				}
				logger.info('File successfully save to Database');
				return sendJSONresponse(res, 200, files);
			});
		}
	});
};

module.exports = { fileUpload };
