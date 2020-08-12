const request = require('supertest');
const setup = require('./setup');

const config = setup.initConfig();
const appError = require('../server/error');
const logger = require('../server/log/logger')({ config });
const errors = require('../server/errors')({ logger });
const middleware = require('../server/middleware')({ config, errors });
const app = require('../server/server')({ middleware, appError });
const modelUtil = require('./utils/util.model.integration');

module.exports = {
  setup,
  modelUtil,
  request,
  app,
};
