const router = require('express').Router();
const userRoutes = require('./user/userRoutes');
const factoryRoutes = require('./factory/factoryRoutes');

const apiRoutes = () => {
  router.use('/users', userRoutes());
  router.use('/factories', factoryRoutes());
  return router;
};

module.exports = apiRoutes;
