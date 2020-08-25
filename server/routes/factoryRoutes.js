const router = require('express').Router();

const factoryRoutes = ({ validators, controllers }) => {
  const { factoryController } = controllers;
  const { factoryValidator } = validators;

  router.param('id', factoryController.params);

  router
    .route('/')
    .get(factoryController.list)
    .post(factoryValidator.validateCreateOrUpdate, factoryController.create);

  router
    .route('/:id')
    .get(factoryController.read)
    .put(factoryValidator.validateCreateOrUpdate, factoryController.update)
    .delete(factoryController.delete);

  return router;
};

module.exports = factoryRoutes;
