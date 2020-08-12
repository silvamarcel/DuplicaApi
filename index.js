const config = require('./server/config/config');
const Store = require('./server/store');
const Logger = require('./server/log/logger');
const Middleware = require('./server/middleware');
const App = require('./server/server');

const logger = Logger({ config });
const store = Store({ config, logger });
const middleware = Middleware({ config, logger });
const { listen } = App({ store, middleware });

// Start the connection with the DB
store.connect();

const { port, env } = config;
listen(port);
logger.info('Listening on', env, port);
