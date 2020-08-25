const { check } = require('express-validator');

const validateCreate = [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
  check('role', 'Role is required').not().isEmpty(),
];

const validateUpdate = [
  check('username', 'Username is required').not().isEmpty(),
  check('role', 'Role is required').not().isEmpty(),
];

module.exports = {
  validateCreate,
  validateUpdate,
};
