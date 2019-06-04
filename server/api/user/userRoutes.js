const router = require('express').Router();
const userController = require('./userController');
const auth = require('../../auth/auth');

const checkUser = [auth.decodeToken(), auth.getFreshUser()];

router.param('id', userController.params);
router.get('/me', checkUser, userController.me);

router.route('/')
  .get(userController.get)
  .post(userController.post);

router.route('/:id')
  .get(userController.getOne)
  .put(checkUser, userController.put)
  .delete(checkUser, userController.delete);

module.exports = router;
