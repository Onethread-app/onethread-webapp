const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);
const config = require('./config/config');
const logger = require('./config/winston');
const client = redis.createClient({
  retry_strategy: function(options) {
    console.log(options.error);
    if (options.error && options.error.code === 'ECONNREFUSED') {
      logger.error(`The server refused the connection`);
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      logger.error('Retry time exhausted');
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
  port: 6379,
  host: `127.0.0.1`,
});

client.auth(config.redis.password, function(err, response) {
  if (err) {
    logger.error(`${err}`);
  }
  logger.info(`authentication: ${response}`);
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
// client.quit();
module.exports = client;
