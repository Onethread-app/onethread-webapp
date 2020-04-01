const RedisClustr = require('redis-clustr');
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);
const config = require('./config/config');
const logger = require('./config/winston');

const client = new RedisClustr({
  servers: [
    {
      host: config.redis.host,
      port: config.redis.port,
    },
  ],
  slotInterval: 1000, // default: none. Interval to repeatedly re-fetch cluster slot configuration
  maxQueueLength: 100, // default: no limit. Maximum length of the getSlots queue (basically number of commands that can be queued whilst connecting to the cluster)
  queueShift: false, // default: true. Whether to shift the getSlots callback queue when it's at max length (error oldest callback), or to error on the new callback
  wait: 5000, // default: no timeout. Max time to wait to connect to cluster before sending an error to all getSlots callbacks
  slaves: 'share',
  createClient: (port, host) => {
    // this is the default behaviour
    return redis.createClient(port, host);
  },
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
