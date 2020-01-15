const router = require('express').Router();
const UserController = require('./userController');
const userValidator = require('./userValidator');

const userRoutes = ({ middleware, appError, auth }) => {
  const userController = UserController({ middleware, appError, auth });

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
