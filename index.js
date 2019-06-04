const config = require('./server/config/config'); // Needs to be the first to load all configurations before everything.
const app = require('./server/server');
const logger = require('./server/utils/logger');
const db = require('./server/utils/db');

// Start the connection with the DB
db.connect();

app.listen(config.port);
logger.info('Listening on', config.env, config.port);
