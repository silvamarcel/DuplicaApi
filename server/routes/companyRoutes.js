const router = require('express').Router();

const companyRoutes = ({ validators, controllers }) => {
  const { companyController } = controllers;
  const { companyValidator } = validators;

  router.param('id', companyController.params);

  router
    .route('/')
    .get(companyController.list)
    .post(companyValidator.validateCreateOrUpdate, companyController.create);

  router
    .route('/:id')
    .get(companyController.read)
    .put(companyValidator.validateCreateOrUpdate, companyController.update)
    .delete(companyController.delete);

  return router;
};

module.exports = companyRoutes;
