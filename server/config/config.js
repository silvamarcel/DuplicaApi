const _ = require('lodash');

let config = {};

const TEN_DAYS_IN_MINUTES = 24 * 60 * 10;

const loadEnvironmentConfigurations = () => {
  try {
    return require(`./${config.env}`);
  } catch (e) {
    return {};
  }
};

const init = () => {
  const DEV = 'dev';

  _.assign(config, {
    dev: 'development',
    test: 'testing',
    stage: 'staging',
    prod: 'production',
    port: process.env.PORT || 3000,
    expireTime: process.env.EXPIRE_TIME || TEN_DAYS_IN_MINUTES,
    secrets: {
      jwt: process.env.JWT,
    },
  });
  process.env.NODE_ENV = process.env.NODE_ENV || DEV;

  config.env = config[process.env.NODE_ENV];

  const envConfig = loadEnvironmentConfigurations();
  config = _.assign(config, envConfig);
};

init();

module.exports = _.assign(config, { init });
