const redis = require("redis");
const config = require("../../config/config");

const client = redis.createClient(config.redis.port, config.redis.host);
const cacheMiddleware = function(req, res, next) {
	const token = req.headers.authorization;
	client.hgetall(token, (err, user) => {
		if (err) {
			return res.json({
				status: 400,
				message: "Something went wrong",
				err
			});
		}
		if (!user) {
			return res.json({
				status: 400,
				message: "Could not find that user"
			});
		}
		next();
	});
};

module.exports = { cacheMiddleware };
