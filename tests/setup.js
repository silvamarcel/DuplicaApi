const config = require('../server/config/config');
const logger = require('../server/utils/logger');
const dbTest = require('../server/utils/db');

const initConfig = () => {
  logger.info('Initializing config files for test...');
  process.env.NODE_ENV = 'test';
  config.init();
  dbTest.mongoose.set('bufferCommands', false);
  // dbTest.mongoose.set('debug', config.mongooseDebug);
  logger.info('Config files for test initialized.');
};

const initModels = async () => {
  logger.info('Initializing models for test...');
  const models = dbTest.mongoose.modelNames();
  if (models) {
    const results = [];
    for (let i = 0; i < models.length; i += 1) {
      const model = models[i];
      results.push(dbTest.mongoose.models[model].ensureIndexes());
    }
    await Promise.all(results);
  }
  logger.info('Models for test initialized.');
};

const startDB = async () => {
  logger.info('Starting the DB connection...');
  await dbTest.connect();
  logger.info('DB connection started.');
};

const cleanDB = async () => {
  logger.info('Cleaning the DB ...');
  await dbTest.mongoose.connection.dropDatabase();
  logger.info('DB cleaned');
};

const init = async () => {
  initConfig();
  await startDB();
  await cleanDB();
  await initModels();
};

const close = async (done) => {
  logger.info('Closing the DB connection...');
  await dbTest.disconnect();
  logger.info('DB connection closed.');
  done();
};

module.exports = {
  init,
  close,
};
