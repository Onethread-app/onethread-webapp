const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const passport = require('passport');
const methodOverride = require('method-override');
const cors = require('cors');
const httpStatus = require('http-status');
const expressWinston = require('express-winston');
const expressValidation = require('express-validation');
const helmet = require('helmet');
const winstonInstance = require('./winston');

const routes = require('../index.route');
const config = require('./config');
const {
  APIError,
  EmailIdExistError,
  SearchNotMatchError,
} = require('../server/helpers/APIError');

const {
  getErrorMessage,
} = require('../server/helpers/mongooseErrorFormat');
const app = express();

if (config.env === 'development' || config.env === 'production') {
  app.use(logger('dev') || logger('prod'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());
app.use(cors());
// TODO: cors customize
// enable CORS - Cross Origin Resource Sharing
// const allowedOrigins = ['http://localhost:4040', ''];
// app.use(cors({
//   credentials: true,
//   origin(origin, callback) { // allow requests with no origin
//     // (like mobile apps or curl requests)
//     if (!origin) {
//       return callback(null, true);
//     }
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not. Allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     } return callback(null, true);
//   }
// }));

// enable detailed API logging in dev env
if (config.env === 'development' || config.env === 'production') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(
    expressWinston.logger({
      winstonInstance,
      meta: true, // optional: log meta data about request (defaults to true)
      msg:
        'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    }),
  );
}

// mount all routes on /api path

app.use('/api/v1', routes); // v1.0

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors
      .map(error => error.messages.join('. '))
      .join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  }
  if (!(err instanceof APIError)) {
    logger.error(`${err.message}`);
    const apiError = new APIError(
      err.message,
      err.status,
      err.isPublic,
    );
    return next(apiError);
  }
  if (err instanceof EmailIdExistError) {
    const emailApiError = new EmailIdExistError(
      err.message,
      err.status,
      err.isPublic,
    );
    return next(emailApiError);
  }

  if (err instanceof SearchNotMatchError) {
    const searchNotMatchError = new SearchNotMatchError(
      err.message,
      err.status,
      err.isPublic,
    );
    return next(searchNotMatchError);
  }
  if (err instanceof getErrorMessage) {
    const mongoDBError = new getErrorMessage(err);
    return next(mongoDBError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(
    expressWinston.errorLogger({
      winstonInstance,
    }),
  );
}

// // error handler, send stacktrace only during development
app.use((err, req, res, next) => {
  const stack =
    config.env === 'development'
      ? err.stack.split('\n').slice(15)
      : {};
  let frame = err.stack.split('at ')[15].trim();
  let lineNumber = frame.split(':')[1];
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack,
    lineNumber,
    frame,
  });
});

module.exports = app;
