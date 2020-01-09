const router = require('express').Router();
const userController = require('./userController');
const userValidator = require('./userValidator');

const userRoutes = () => {
  router.param('id', userController.params);
  router.get('/me', userController.me);

  router.route('/')
    .get(userController.list)
    .post(userValidator.validateCreateOrUpdate, userController.create);

  router.route('/:id')
    .get(userController.read)
    .put(userController.update)
    .delete(userController.delete);

  return router;
};

module.exports = userRoutes;
