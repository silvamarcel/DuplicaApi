const appMiddleware = require('./appMiddleware');
const errorHandlingMiddleware = require('./errorHandlingMiddleware');
const validation = require('./validation');

const middleware = ({ config, logger }) => ({
  appMiddleware: appMiddleware({ config }),
  appValidation: validation,
  errorHandlingMiddleware: errorHandlingMiddleware({ logger }),
});

module.exports = middleware;
