const redis = require('redis');

const config = require('./config/config');

const client = redis.createClient(
  config.redis.port,
  config.redis.host,
);

module.exports = client;
