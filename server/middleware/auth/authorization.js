const acl = require('express-acl');

const aclOptions = {
  filename: 'acl.json',
  path: 'server/config',
  baseUrl: 'api',
  decodedObjectName: 'user',
};

const authorization = () => {
  // Setup of the Access Control List configuration
  acl.config(aclOptions);
  return acl.authorize.unless({ path: ['/auth/signin'] });
};

module.exports = authorization;
