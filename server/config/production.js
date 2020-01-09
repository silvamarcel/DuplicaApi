module.exports = {
  logging: false,
  logLevel: 'error',
  userManager: process.env.USER_MANAGER,
  passManager: process.env.PASS_MANAGER,
  roleManager: process.env.ADMIN_MANAGER,
  db: {
    url: process.env.MONGODB_URI,
  },
  secrets: {
    jwt: process.env.JWT,
  },
};
