module.exports = {
  logging: true,
  logLevel: 'debug',
  db: {
    url: process.env.MONGODB_URI || 'mongodb://localhost/duplica',
  },
  secrets: {
    jwt: process.env.JWT || 'devJWTSecret',
  },
};
