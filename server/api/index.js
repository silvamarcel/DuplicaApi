const router = require('express').Router();
const userRoutes = require('./user/userRoutes');
const factoryRoutes = require('./factory/factoryRoutes');

const apiRoutes = ({ auth }) => {
  router.use('/users', userRoutes({ auth }));
  router.use('/factories', factoryRoutes({ auth }));
  return router;
};

module.exports = apiRoutes;
