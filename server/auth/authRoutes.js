const router = require('express').Router();
const { verifyUser } = require('./auth');
const authController = require('./authController');

router.post('/signin', verifyUser(), authController.signin);

module.exports = router;
