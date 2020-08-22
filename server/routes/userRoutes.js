const router = require('express').Router();

const userRoutes = ({ validators, controllers }) => {
  const { userController } = controllers;
  const { userValidator } = validators;

  router.param('id', userController.params);
  router.get('/me', userController.me);

  router
    .route('/')
    .get(userController.list)
    .post(userValidator.validateCreate, userController.create);

  router
    .route('/:id')
    .get(userController.read)
    .put(userValidator.validateUpdate, userController.update)
    .delete(userController.delete);

  return router;
};

module.exports = userRoutes;
