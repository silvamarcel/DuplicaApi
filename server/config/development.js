module.exports = {
  logging: true,
  logLevel: 'debug',
  userManager: 'admin',
  passManager: '12345',
  roleManager: 'admin',
  db: {
    url: process.env.MONGODB_URI || 'mongodb://localhost/duplica',
  },
  secrets: {
    jwt: process.env.JWT || 'devJWTSecret',
  },
};
