const winston = require('winston');

const logger = ({ config }) =>
  winston.createLogger({
    silent: config.env === 'testing',
    transports: [
      new winston.transports.Console({
        level: config.logLevel,
        timestamp: new Date().toISOString(),
      }),
    ],
  });

module.exports = logger;
