const mongoose = require('mongoose');

const Connect = (config, logger) => async () => {
  logger.info('Connecting to MongoDB...');
  const connection = await mongoose.connect(config.db.url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  logger.info('Connected to MongoDB.');
  return connection;
};

const Disconnect = logger => async () => {
  logger.info('Disconnecting from MongoDB...');
  await mongoose.disconnect();
  logger.info('Disconnected from MongoDB...');
};

module.exports = ({ config, logger }) => {
  const connect = Connect(config, logger);
  const disconnect = Disconnect(logger);

  return {
    mongoose,
    connect,
    disconnect,
  };
};
