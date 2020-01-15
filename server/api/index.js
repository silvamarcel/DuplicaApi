const router = require('express').Router();
const userRoutes = require('./user/userRoutes');
const factoryRoutes = require('./factory/factoryRoutes');

const apiRoutes = ({ middleware, appError }) => {
  router.use('/users', userRoutes({ middleware, appError }));
  router.use('/factories', factoryRoutes({ middleware }));
  return router;
};

module.exports = apiRoutes;
