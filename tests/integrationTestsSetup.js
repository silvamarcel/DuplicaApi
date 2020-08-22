const request = require('supertest');
const setup = require('./setup');

const config = setup.initConfig();
const logger = require('../server/log/logger')({ config });
const store = require('../server/store')({ config, logger });
const errors = require('../server/errors')({ logger });
const middleware = require('../server/middleware')({ store, config, errors });
const app = require('../server/server')({ middleware, store });
const modelUtil = require('./utils/util.model.integration');

module.exports = {
  setup,
  modelUtil,
  request,
  app,
};
