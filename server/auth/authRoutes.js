const router = require('express').Router();
const authController = require('./authController');

const authRoutes = ({ auth }) => {
  router.post('/signin', auth.verifyUser(), authController.signin);
  return router;
};

module.exports = {
  authRoutes,
};
