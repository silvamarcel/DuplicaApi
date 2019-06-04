const router = require('express').Router();
const userRoutes = require('./user/userRoutes');

router.use('/users', userRoutes);

module.exports = router;
