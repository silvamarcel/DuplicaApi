const router = require('express').Router();

const authRoutes = ({ auth, authController }) => {
  router.post('/signin', auth.verifyUser(), authController.signin);
  return router;
};

module.exports = {
  authRoutes,
};
