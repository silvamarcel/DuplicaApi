const router = require('express').Router();

const UserRoutes = require('./userRoutes');
const FactoryRoutes = require('./factoryRoutes');

module.exports = ({ validators, controllers }) => {
  router.use('/users', UserRoutes({ validators, controllers }));
  router.use('/factories', FactoryRoutes({ validators, controllers }));

  return router;
};
