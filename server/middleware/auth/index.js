const Auth = require('./auth');
const AuthController = require('./authController');
const authorization = require('./authorization');
const { authRoutes } = require('./authRoutes');

module.exports = ({ store, config }) => {
  const auth = Auth({ store, config });
  const authController = AuthController({ auth });
  return {
    signToken: auth.signToken,
    authMiddleware: [auth.decodeToken(), authorization()],
    authRoutes: authRoutes({ auth, authController }),
  };
};
