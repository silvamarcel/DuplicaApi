const { check, body } = require('express-validator');

const validateCreateOrUpdate = [
  check('businessId', 'Factory businessId is required').not().isEmpty(),
  check('name', 'Factory name is required').not().isEmpty(),
  check('contract', 'Factory contract is required').not().isEmpty(),
  check('address.zipCode', 'Factory zipCode can only contains numbers')
    .if(body('address.zipCode').exists())
    .isInt(),
];

module.exports = {
  validateCreateOrUpdate,
};
