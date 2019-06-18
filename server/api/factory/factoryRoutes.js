const router = require('express').Router();
const factoryController = require('./factoryController');
const factoryValidator = require('./factoryValidator');
const auth = require('../../auth/auth');

const validateAuth = [auth.decodeToken()];

router.param('id', factoryController.params);

router.route('/')
  .get(validateAuth, factoryController.list)
  .post(validateAuth,
    factoryValidator.validateCreateOrUpdate,
    factoryController.create);

router.route('/:id')
  .get(validateAuth, factoryController.read)
  .put(validateAuth,
    factoryValidator.validateCreateOrUpdate,
    factoryController.update)
  .delete(validateAuth, factoryController.delete);

module.exports = router;
