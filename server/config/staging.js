module.exports = {
  logging: true,
  logLevel: 'error',
  db: {
    url: process.env.MONGODB_URI || 'mongodb://localhost/duplica',
  },
  secrets: {
    jwt: process.env.JWT || 'stagingJWTSecret',
  },
};
