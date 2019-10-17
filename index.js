const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const debug = require('debug')('express-mongoose-es6-rest-api:index');
// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');
const logger = require('./config/winston');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoUri);
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(
      `${collectionName}.${method}`,
      util.inspect(query, false, 20),
      doc,
    );
  });
}

// connect to redis connection
const redisUri = config.redis.host;
const redisPort = config.redis.port;
const rediscl = redis.createClient(redisPort, redisUri);
rediscl.on('connect', () => {
  logger.info('REDIS ready');
});
rediscl.on('error', err => {
  logger.error('REDIS ' + err.message);
});
rediscl.on('end', function() {
  logger.info('REDIS disconnect');
});

app.on('listening', () => {
  console.log('ok, server is running');
});

if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    console.info(
      `server started on port ${config.port} (${config.env})`,
    );
  });
}

module.exports = app;
