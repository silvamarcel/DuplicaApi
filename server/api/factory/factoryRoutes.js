const router = require('express').Router();
const factoryController = require('./factoryController');
const factoryValidator = require('./factoryValidator');
const auth = require('../../auth/auth');

const checkUser = [auth.decodeToken(), auth.getFreshUser()];

router.param('id', factoryController.params);

router.route('/')
  .get(checkUser, factoryController.list)
  .post(checkUser,
    factoryValidator.validateCreateOrUpdate,
    factoryController.create);

router.route('/:id')
  .get(checkUser, factoryController.read)
  .put(checkUser,
    factoryController.update,
    factoryValidator.validateCreateOrUpdate)
  .delete(checkUser, factoryController.delete);

module.exports = router;
