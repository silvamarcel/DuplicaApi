const { check } = require('express-validator/check');

const validateCreateOrUpdate = [
  check('name', 'Factory name is required').not().isEmpty(),
];

module.exports = {
  validateCreateOrUpdate,
};
