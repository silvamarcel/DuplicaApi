const auth = require('./auth');
const authorization = require('./authorization');
const { authRoutes } = require('./authRoutes');

module.exports = {
  signToken: auth.signToken,
  authMiddleware: [auth.decodeToken(), authorization()],
  authRoutes: authRoutes({ auth }),
};
