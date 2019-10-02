const winston = require('winston');
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');

const LOG_LEVEL = process.env.LOG_LEVEL;
const LOG_TO_FILE = process.env.LOG_TO_FILE;
const isTest = process.env.isTest;
const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
const level = levels.find(x => x === LOG_LEVEL) || 'error';

const logger = new winston.createLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true,
    }),
  ],
});

if (LOG_TO_FILE === true && isTest === false) {
  const logsPath = path.resolve(__dirname, '../server/logs/');

  if (fs.existsSync(logsPath) === false) {
    fs.mkdirSync(logsPath);
  }

  logger.add(winston.transports.File, {
    name: 'error-file',
    level: 'error',
    stream: rfs('error.log', { interval: '1d', path: logsPath }),
  });

  logger.add(winston.transports.File, {
    name: 'warn-file',
    level: 'warn',
    stream: rfs('warn.log', { interval: '1d', path: logsPath }),
  });
}

if (isTest === true) {
  logger.remove(winston.transports.Console);
}
module.exports = logger;
