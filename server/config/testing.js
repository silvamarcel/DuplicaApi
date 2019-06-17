module.exports = {
  logging: true,
  logLevel: 'error',
  userManager: 'admin',
  passManager: '12345',
  db: {
    url: process.env.MONGODB_URI || 'mongodb://localhost/duplicatest',
  },
  secrets: {
    jwt: process.env.JWT || 'testingJWTSecret',
  },
};
