const { check } = require('express-validator/check');

const validateCreateOrUpdate = [
  check('businessId', 'Factory businessId is required').not().isEmpty(),
  check('name', 'Factory name is required').not().isEmpty(),
  check('contract', 'Factory contract is required').not().isEmpty(),
];

module.exports = {
  validateCreateOrUpdate,
};
