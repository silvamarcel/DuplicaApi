const router = require('express').Router();
const Validators = require('./validators');
const Services = require('./services');
const Controllers = require('./controllers');
const Routes = require('./routes');

const api = ({ store, middleware }) => {
  const validators = Validators();
  const services = Services({ store });
  const controllers = Controllers({ middleware, services });
  const routes = Routes({ validators, controllers });

  router.use('/api', routes);
  return router;
};

module.exports = api;
