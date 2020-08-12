const appMiddleware = require('./appMiddleware');
const errorHandlingMiddleware = require('./errorHandlingMiddleware');
const validation = require('./validation');

const middleware = ({ config, errors }) => ({
  appMiddleware: appMiddleware({ config }),
  appValidation: validation,
  errorHandlingMiddleware: errorHandlingMiddleware({ errors }),
});

module.exports = middleware;
