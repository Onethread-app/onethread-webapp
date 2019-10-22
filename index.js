const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('express-mongoose-es6-rest-api:index');

Promise = require('bluebird');
const loggerDispatcher = 'Index';
// config should be imported before importing any other file
const config = require('./config/config');
const client = require('./index.redis');
const app = require('./config/express');
const logger = require('./config/winston');

const { webhook } = require('./server/services/slack.services.js');

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
  logger.warn(`unable to connect to database: ${mongoUri}`);
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
client.on('connect', () => {
  logger.info('REDIS ready');
});
client.on('error', err => {
  logger.error('REDIS ' + err.message);
});
client.on('end', function() {
  logger.info('REDIS disconnect');
});

app.on('listening', () => {
  logger.info('ok, server is running');
});

if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    logger.info(
      `server started on port ${config.port} (${config.env})`,
    );
  });
}

process.on('unhandledRejection', async (err, promise) => {
  webhook(err);
  logger.warn(err, {
    dispatcher: loggerDispatcher,
    from: 'unhandledRejection event',
    promise,
  });
});

process.on('unhandledRejection', async (err, promise) => {
  webhook(err);
  logger.warn(err, {
    dispatcher: loggerDispatcher,
    from: 'unhandledRejection event',
    promise,
  });
});

process.on('uncaughtException', err => {
  webhook(err);
  logger.error(
    err,
    { dispatcher: loggerDispatcher, from: 'uncaughtException event' },
    () => {
      process.exit(1);
    },
  );
});
process.on('exit', async code => {
  webhook(code);
  mongoose.connection.close();
  logger.info(`About to exit with code: ${code}`);
});
process.on('SIGINT', function() {
  webhook(`Caught interrupt signal`);
  logger.info('Caught interrupt signal');
  process.exit();
});
module.exports = app;
