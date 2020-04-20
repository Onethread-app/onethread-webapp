const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('express-mongoose-es6-rest-api:index');

Promise = require('bluebird');
const loggerDispatcher = 'Index';
// config should be imported before importing any other file
const config = require('./config/config');
//const client = require('./index.redis');
const app = require('./config/express');
const logger = require('./config/winston');
const { IndexElasticSearch } = require('./index.elasticsearch');

const { webhook } = require('./server/services/slack.services.js');

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoUri, () => {});
logger.info('MongoDB is connected');
IndexElasticSearch();
mongoose.connection.on('error', () => {
  // webhook('unable to connect database');
  logger.error(`unable to connect to database: ${mongoUri}`);
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

// var apm = require('elastic-apm-node').start({
//   // Override service name from package.json
//   // Allowed characters: a-z, A-Z, 0-9, -, _, and space
//   serviceName: 'tigrowkibana',

//   // Use if APM Server requires a token
//   secretToken: 'false',

//   serverUrl: 'http://localhost:8200'
// });

if (!module.parent) {
  // Event listener for HTTP server "error" event.
  // function onError(error) {
  // 	if (error.syscall !== 'listen') {
  // 		throw error;
  // 	}

  // 	var bind =
  // 		typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  // 	console.log(error.code);
  // 	// handle specific listen errors with friendly messages
  // 	switch (error.code) {
  // 		case 'EACCES':
  // 			console.error(bind + ' requires elevated privileges');
  // 			process.exit(1);
  // 			break;
  // 		case 'EADDRINUSE':
  // 			console.error(bind + ' is already in use');
  // 			process.exit(1);
  // 			break;
  // 		case 'ECONNREFUSED':
  // 			logger.error(bind + 'is failed to connect');
  // 			process.exit(1);
  // 		default:
  // 			throw error;
  // 	}
  // }

  // listen on port config.port
  app.listen(config.port, () => {
    logger.info(
      `Ok, server is running on port ${config.port} (${config.env})`,
    );
  });
}

process.on('unhandledRejection', async (err, promise) => {
  logger.error(err, {
    dispatcher: loggerDispatcher,
    from: 'unhandledRejection event',
    promise,
  });
});

process.on('uncaughtException', (err) => {
  logger.error(
    err,
    { dispatcher: loggerDispatcher, from: 'uncaughtException event' },
    () => {
      process.exit(1);
    },
  );
});
process.on('exit', async (code) => {
  mongoose.connection.close();
  logger.info(`About to exit with code: ${code}`);
});
process.on('SIGINT', function () {
  logger.info('Caught interrupt signal');
  process.exit();
});
module.exports = app;
