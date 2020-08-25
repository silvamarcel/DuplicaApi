const Auth = require('./auth');
const appMiddleware = require('./appMiddleware');
const errorHandlingMiddleware = require('./errorHandlingMiddleware');
const validation = require('./validation');

const middleware = ({ store, config, errors }) => ({
  auth: Auth({ store, config }),
  appMiddleware: appMiddleware({ config }),
  appValidation: validation,
  errorHandlingMiddleware: errorHandlingMiddleware({ errors }),
});

module.exports = middleware;
