const appMiddleware = require('./appMiddleware');
const errorHandlingMiddleware = require('./errorHandlingMiddleware');

const middleware = ({ config, logger }) => ({
  appMiddleware: appMiddleware({ config }),
  errorHandlingMiddleware: errorHandlingMiddleware({ logger }),
});

module.exports = middleware;
