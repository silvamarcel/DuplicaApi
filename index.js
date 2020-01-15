const config = require('./server/config/config');
const Database = require('./server/store/database');
const Logger = require('./server/log/logger');
const Middleware = require('./server/middleware');
const appError = require('./server/error');
const App = require('./server/server');

const database = Database({ config });
const logger = Logger({ config });
const middleware = Middleware({ config, logger });
const app = App({ middleware, appError });

// Start the connection with the DB
database.connect();

app.listen(config.port);
logger.info('Listening on', config.env, config.port);
