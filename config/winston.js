const winston = require('winston');
const winstonTimestampColorize = require('winston-timestamp-colorize');
// const path = require('path');
// const fs = require('fs');
// const rfs = require('rotating-file-stream');

// const LOG_LEVEL = process.env.LOG_LEVEL;
// const LOG_TO_FILE = process.env.LOG_TO_FILE;
// const isTest = process.env.isTest;
// const levels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];

const logger = new winston.createLogger({
  level: 'verbose',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.metadata(),
    winston.format.json(),
    winston.format.timestamp(),
    winstonTimestampColorize({ color: 'yellow' }),
    winston.format.printf(log => {
      return `${log.level}:${log.message} => ${log.timestamp}`;
    }),
  ),
  transports: [
    new winston.transports.Console({ colorize: true }),
    new winston.transports.File({
      colorize: true,
      json: false,
      filename: 'cemui.log',
    }),
    new winston.transports.File({
      colorize: true,
      json: false,
      filename: 'cemui.error.log',
      level: 'error',
    }),
    new winston.transports.File({
      colorize: true,
      json: false,
      filename: 'cemui.info.log',
      level: 'info',
    }),
  ],
});

module.exports = logger;
