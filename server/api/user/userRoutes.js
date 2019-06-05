const router = require('express').Router();
const userController = require('./userController');
const auth = require('../../auth/auth');

const checkUser = [auth.decodeToken(), auth.getFreshUser()];

router.param('id', userController.params);
router.get('/me', checkUser, userController.me);

router.route('/')
  .get(userController.list)
  .post(userController.create);

router.route('/:id')
  .get(userController.read)
  .put(checkUser, userController.update)
  .delete(checkUser, userController.delete);

module.exports = router;
