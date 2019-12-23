const router = require('express').Router();
const userController = require('./userController');
const userValidator = require('./userValidator');

const userRoutes = ({ auth }) => {
  const checkUser = [auth.decodeToken(), auth.getFreshUser()];
  const validateAuth = [auth.decodeToken()];

  router.param('id', userController.params);
  router.get('/me', checkUser, userController.me);

  router.route('/')
    .get(validateAuth, userController.list)
    .post(validateAuth,
      userValidator.validateCreateOrUpdate,
      userController.create);

  router.route('/:id')
    .get(validateAuth, userController.read)
    .put(validateAuth, userController.update)
    .delete(validateAuth, userController.delete);

  return router;
};

module.exports = userRoutes;
