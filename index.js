const config = require('./server/config/config'); // Needs to be the first to load all configurations before everything.
const db = require('./server/store/database')({ config });
const logger = require('./server/logger/logger')({ config });
const middleware = require('./server/middleware')({ config, logger });
const app = require('./server/server')({ config, logger, middleware });

// Start the connection with the DB
db.connect();

app.listen(config.port);
logger.info('Listening on', config.env, config.port);
