const _ = require('lodash');

let config = {};

const init = () => {
  const DEV = 'dev';
  _.assign(config, {
    dev: 'development',
    test: 'testing',
    stage: 'staging',
    prod: 'production',
    port: process.env.PORT || 3000,
    // 10 days in minutes
    expireTime: process.env.EXPIRE_TIME || 24 * 60 * 10,
    secrets: {
      jwt: process.env.JWT,
    },
  });

  // Check if NODE_ENV was setted
  process.env.NODE_ENV = process.env.NODE_ENV || DEV;
  config.env = config[process.env.NODE_ENV];

  // Will load the configurations of the environment which is running.
  let envConfig;
  try {
    envConfig = require(`./${config.env}`);
  } catch (e) {
    envConfig = {};
  }
  config = _.assign(config, envConfig);
};

init();

module.exports = _.assign(config, { init });
