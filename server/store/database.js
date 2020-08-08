const mongoose = require('mongoose');

const connect = ({ config }) => () =>
  mongoose.connect(config.db.url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
const disconnect = () => mongoose.disconnect();

module.exports = ({ config }) => ({
  mongoose,
  connect: connect({ config }),
  disconnect,
});
