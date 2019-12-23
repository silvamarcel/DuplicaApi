const express = require('express');
const acl = require('express-acl');

const api = require('./api');
const { auth, authRoutes } = require('./auth');

const aclOptions = {
  filename: 'acl.json',
  path: 'server/config',
  baseUrl: 'api',
  decodedObjectName: 'user',
};

const server = ({ middleware }) => {
  const app = express();

  // Setup of the Access Control List configuration
  acl.config(aclOptions);
  app.use(acl.authorize);

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
