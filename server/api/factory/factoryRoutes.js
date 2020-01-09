const router = require('express').Router();
const factoryController = require('./factoryController');
const factoryValidator = require('./factoryValidator');

const factoryRoutes = () => {
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
