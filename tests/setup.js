const config = require('../server/config/config');
const Errors = require('../server/errors');
const Store = require('../server/store');
const Logger = require('../server/log/logger');
const Middleware = require('../server/middleware');
const Services = require('../server/services');
const Controllers = require('../server/controllers');
const seeds = require('./seeds');
const request = require('./request');

const logger = Logger({ config });
const errors = Errors({ logger });
const store = Store({ config, logger });
const middleware = Middleware({ store, config, errors });

const services = Services({ store });
const { userController } = Controllers({ middleware, services });

const initConfig = () => {
  logger.info('Initializing config files for test...');
  process.env.NODE_ENV = 'test';
  config.init();
  store.mongoose.set('bufferCommands', false);
  // store.mongoose.set('debug', config.mongooseDebug);
  logger.info('Config files for test initialized.');
  return config;
};

const initModels = async () => {
  logger.info('Initializing models for test...');
  const models = store.mongoose.modelNames();
  if (models) {
    const results = [];
    for (let i = 0; i < models.length; i += 1) {
      const model = models[i];
      results.push(store.mongoose.models[model].ensureIndexes());
    }
    await Promise.all(results);
  }
  logger.info('Models for test initialized.');
};

const createUserManager = async () => {
  logger.info('Creating user manager...');
  await userController.createManagerUser({
    username: config.userManager,
    password: config.passManager,
    role: config.roleManager,
  });
  logger.info('User manager created.');
};

const startDB = async () => {
  logger.info('Starting the DB connection...');
  await store.connect();
  logger.info('DB connection started.');
};

const cleanDB = async () => {
  logger.info('Cleaning the DB ...');
  await store.mongoose.connection.dropDatabase();
  logger.info('DB cleaned');
};

const init = async () => {
  initConfig();
  await startDB();
  await cleanDB();
  await initModels();
  await createUserManager();
};

const close = async done => {
  logger.info('Closing the DB connection...');
  await store.disconnect();
  logger.info('DB connection closed.');
  done();
};

module.exports = {
  init,
  initConfig,
  close,
  seeds,
  request,
};
