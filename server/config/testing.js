module.exports = {
  logging: true,
  logLevel: 'error',
  db: {
    url: process.env.MONGODB_URI || 'mongodb://localhost/duplicatest',
  },
  secrets: {
    jwt: process.env.JWT || 'testingJWTSecret',
  },
};
