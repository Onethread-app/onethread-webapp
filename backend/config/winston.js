const winston = require('winston');

const getFileAndLine = (info) => {
  if (info instanceof Error || info.level === 'error') {
    if (info.metadata.stack) {
      const fileLineName = info.metadata.stack
        .split('\n')
        .slice()[1]
        .split('(')[1]
        .split(')')[0];

      return fileLineName;
    }
    return '';
  }
  return '';
};

const logger = new winston.createLogger({
  levels: winston.config.npm.levels,
  defaultMeta: { service: 'user-service' },
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.metadata(),
    winston.format.json(),
    winston.format.timestamp(),
    winston.format.prettyPrint(),
    winston.format.printf((log) => {
      const errLine = getFileAndLine(log);
      return `${log.level}: ${!errLine ? '' : errLine} ${
        process.pid
      } ${log.message} ${log.timestamp} `;
    }),
  ),
  transports: [
    new winston.transports.Console({ colorize: true }),
    new winston.transports.File({
      colorize: true,
      json: false,
      filename: 'tigrow.log',
    }),
    new winston.transports.File({
      colorize: true,
      json: false,
      filename: 'tigrow.error.log',
      level: 'error',
      prettyPrint: true,
    }),
    new winston.transports.File({
      colorize: true,
      json: false,
      filename: 'tigrow.info.log',
      level: 'info',
    }),
  ],
});

module.exports = logger;
