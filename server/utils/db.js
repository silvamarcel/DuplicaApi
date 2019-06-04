const mongoose = require('mongoose');
const config = require('../config/config');

const connect = () => mongoose.connect(config.db.url, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
const disconnect = () => mongoose.disconnect();

module.exports = {
  mongoose,
  connect,
  disconnect,
};
