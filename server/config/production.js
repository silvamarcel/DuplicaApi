module.exports = {
  logging: false,
  logLevel: 'error',
  db: {
    url: process.env.MONGODB_URI,
  },
  secrets: {
    jwt: process.env.JWT,
  },
};
