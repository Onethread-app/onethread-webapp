const redis = require('redis');

const config = require('./config/config');
const logger = require('./config/winston');

const client = redis.createClient({
	port: 15356,
	host: config.redis.host,
	password: config.redis.password,
});
client.on('connect', () => {
	logger.info('REDIS ready');
});
client.on('error', err => {
	logger.error('REDIS ' + err.message);
});
client.on('end', function() {
	logger.info('REDIS disconnect');
});
module.exports = client;
