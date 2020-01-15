const express = require('express');

const { authRoutes, auth } = require('./auth');
const api = require('./api');

const server = ({ middleware, appError }) => {
  const app = express();

  // Setup the app's middlewares
  app.use(middleware.appMiddleware());

  // Setup of the authentication routes
  app.use('/auth/', authRoutes);

  // Setup of the authentication middleware
  app.use(auth);

  // Setup the api routes
  app.use('/api/', api({ middleware, appError }));

  // Setup the global error handling
  app.use(middleware.errorHandlingMiddleware);
  return app;
};

// Exports the app for tests
module.exports = server;
