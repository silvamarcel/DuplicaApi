const auth = require('./auth');
const authorization = require('./authorization');
const { authRoutes } = require('./authRoutes');

module.exports = {
  auth: [auth.decodeToken(), authorization()],
  authRoutes: authRoutes({ auth }),
};
