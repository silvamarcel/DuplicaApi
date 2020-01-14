const router = require('express').Router();
const userRoutes = require('./user/userRoutes');
const factoryRoutes = require('./factory/factoryRoutes');

const apiRoutes = ({ middleware }) => {
  router.use('/users', userRoutes({ middleware }));
  router.use('/factories', factoryRoutes({ middleware }));
  return router;
};

module.exports = apiRoutes;
