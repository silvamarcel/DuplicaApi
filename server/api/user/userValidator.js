const { check } = require('express-validator/check');

const validateCreateOrUpdate = [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
  check('role', 'Role is required').not().isEmpty(),
];

module.exports = {
  validateCreateOrUpdate,
};
