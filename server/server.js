const express = require('express');

const { auth, authRoutes, authorization } = require('./auth');
const api = require('./api');

const server = ({ middleware }) => {
  const app = express();

  // Setup the app middleware's
  middleware.appMiddleware(app);

  // Setup of Authentication Verification
  app.use('/auth/', authRoutes);
  app.use(auth.decodeToken());

  app.use(authorization());

  // Setup the api routes
  app.use('/api/', api());

  // Setup the global error handling
  app.use(middleware.errorHandlingMiddleware);
  return app;
};

// Exports the app for tests
module.exports = server;
