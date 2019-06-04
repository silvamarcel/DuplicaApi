const express = require('express');

const api = require('./api');
const auth = require('./auth/authRoutes');
const appMiddleware = require('./middleware/appMiddleware');
const errorHandling = require('./middleware/errorHandlingMiddleware');

const app = express();

// Setup the app middleware's
appMiddleware(app);

// Setup the api routes
app.use('/api/', api);
app.use('/auth/', auth);

// Setup the global error handling
app.use(errorHandling);

// Exports the app for tests
module.exports = app;
