const AWS = require('aws-sdk');
const config = require('../../config/config');
const logger = require('../../config/winston');
const { sendJSONresponse } = require('../helpers/jsonResponse');
const File = require('./file.model');
const Account = require('../account/account.model');
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
	const userID = req.user._id;
	const s3FileURL = `https://tigrow-test-1.s3.amazonaws.com/`;
	let s3bucket = new AWS.S3({
		accessKeyId: config.awsAccessKey,
		secretAccessKey: config.awsSecretAccessKey,
		region: config.s3Region,
	});
	const params = {
		Bucket: 'tigrow-test-1',
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
				fileLink: s3FileURL + params.Bucket,
				s3Key: params.Key,
				account: userID,
				fileType: params.ContentType,
			};
			const file = new File(newFile);
			file
				.save()
				.then(async data => {
					logger.info('File Link successfully save to Database');
					const account = await Account.findOne({
						_id: userID,
					}).select('avatar');
					account.avatar = data._id;
					await account.save();
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

module.exports = { fileUpload };
