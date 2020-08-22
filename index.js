const config = require('./server/config/config');
const Errors = require('./server/errors');
const Store = require('./server/store');
const Logger = require('./server/log/logger');
const Middleware = require('./server/middleware');
const App = require('./server/server');

const logger = Logger({ config });
const errors = Errors({ logger });
const store = Store({ config, logger });
const middleware = Middleware({ store, config, errors });
const { listen } = App({ store, middleware });

// TODO Improve this to make use of a list of services which need to be started
// Start the connection with the DB
store.connect();

const { port, env } = config;
listen(port);
logger.info('Listening on', env, port);
