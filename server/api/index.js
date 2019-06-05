const router = require('express').Router();
const userRoutes = require('./user/userRoutes');
const factoryRoutes = require('./factory/factoryRoutes');

router.use('/users', userRoutes);
router.use('/factories', factoryRoutes);

module.exports = router;
