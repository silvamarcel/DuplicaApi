const express = require('express');

const api = require('./api');
const { auth, authRoutes } = require('./auth');

const server = ({ middleware }) => {
  const app = express();

  // Setup the app middleware's
  middleware.appMiddleware(app);

  // Setup the api routes
  app.use('/api/', api({ auth }));
  app.use('/auth/', authRoutes);

  // Setup the global error handling
  app.use(middleware.errorHandlingMiddleware);
  return app;
};

// Exports the app for tests
module.exports = server;
