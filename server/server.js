const express = require('express');

const health = require('./health');
const api = require('./api');

const server = ({ store, middleware }) => {
  const app = express();

  const { auth } = middleware;

  // Setup the app's middlewares
  app.use(middleware.appMiddleware());

  // Setup of the health routes
  app.use('/', health());

  // Setup of the authentication routes
  app.use('/auth/', auth.authRoutes);

  // Setup of the authentication middleware
  app.use(auth.authMiddleware);

  // Setup the api routes
  app.use('/', api({ store, middleware }));

  // Setup the global error handling
  app.use(middleware.errorHandlingMiddleware);
  return app;
};

// Exports the app for tests
module.exports = server;
