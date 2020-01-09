const express = require('express');
const acl = require('express-acl');

const { auth, authRoutes } = require('./auth');
const api = require('./api');

const aclOptions = {
  filename: 'acl.json',
  path: 'server/config',
  baseUrl: 'api',
  decodedObjectName: 'user',
};

const server = ({ middleware }) => {
  const app = express();

  // Setup the app middleware's
  middleware.appMiddleware(app);

  // Setup of Authentication Verification
  app.use('/auth/', authRoutes);
  app.use(auth.decodeToken());

  // Setup of the Access Control List configuration
  acl.config(aclOptions);
  app.use(acl.authorize.unless({ path: ['/auth/signin'] }));

  // Setup the api routes
  app.use('/api/', api());

  // Setup the global error handling
  app.use(middleware.errorHandlingMiddleware);
  return app;
};

// Exports the app for tests
module.exports = server;
