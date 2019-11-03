const winston = require('winston');

const winstonTimestampColorize = require('winston-timestamp-colorize');
const logger = new winston.createLogger({
  levels: winston.config.syslog.levels,
  //defaultMeta: { service: 'user-service' },
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
