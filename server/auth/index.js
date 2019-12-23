const auth = require('./auth');
const { authRoutes } = require('./authRoutes');

module.exports = {
  auth,
  authRoutes: authRoutes({ auth }),
};
