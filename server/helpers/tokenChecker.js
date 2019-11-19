const jwt = require('jsonwebtoken');
const { sendJSONresponse } = require('./jsonResponse');
const config = require('../../config/config');
const client = require('../../index.redis');
module.exports = (req, res, next) => {
	let accessToken;
	let hasMultiplePlaces = false;

	// const QUERY_AUTHORIZACION_KEY = 'access_token';
	const bodyAuthorizationKey = 'access_token';
	const headerAuthorizationKey = 'Bearer';

	// if (req.query && req.query[QUERY_AUTHORIZATION_KEY]) {
	//     accessToken = req.query[QUERY_AUTHORIZATION_KEY];
	// }

	if (req.body && req.body[bodyAuthorizationKey]) {
		if (accessToken) {
			hasMultiplePlaces = true;
		}
		accessToken = req.body[bodyAuthorizationKey];
	}
	if (req.headers && req.headers.authorization) {
		var parts = req.headers.authorization.split(' ');
		if (parts.length === 2 && parts[0] === headerAuthorizationKey) {
			if (accessToken) {
				hasMultiplePlaces = true;
			}
			accessToken = parts[1];
		} else {
			return sendJSONresponse(res, 400, {
				message: 'Bad HTTP Authentication Header',
			});
		}
	}

	if (hasMultiplePlaces) {
		return res.status(400).send({
			statusCode: 400,
			error: 'Bad Request',
			message:
				'RFC6750 states the access_token MUST NOT be provided in more than one place in a single request',
		});
	} else {
		if (accessToken) {
			// 1st step: try accessToken key exist in cache server
			// 2nd step: if exist set accessToken value into req.user
			// 3rd step: if not exist in cache server catch it,
			// 4th step: decode it from req.user
			try {
			} catch (error) {
				jwt.verify(accessToken, config.accessTokenSecret, function(
					err,
					decoded,
				) {
					if (err) {
						return res.status(401).json({
							statusCode: 401,
							error: 'Unauthorized',
							message: err.message,
						});
					}
					req.user = decoded;
					next();
				});
			}
		} else {
			return res.status(401).send({
				statusCode: 401,
				error: 'Unauthorized',
				message: 'No token provided',
			});
		}
	}
};
