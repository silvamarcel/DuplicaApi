const router = require('express').Router();
const FactoryController = require('./factoryController');
const factoryValidator = require('./factoryValidator');

const factoryRoutes = ({ middleware, appError, auth }) => {
  const factoryController = FactoryController({ middleware, appError, auth });
  router.param('id', factoryController.params);

  router.route('/')
    .get(factoryController.list)
    .post(factoryValidator.validateCreateOrUpdate, factoryController.create);

  router.route('/:id')
    .get(factoryController.read)
    .put(factoryValidator.validateCreateOrUpdate, factoryController.update)
    .delete(factoryController.delete);

  return router;
};

module.exports = factoryRoutes;
