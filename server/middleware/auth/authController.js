/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const _ = require('lodash');

const authController = ({ auth }) => {
  const signin = (req, res, next) => {
    try {
      const user = _.pick(req.user, ['_id', 'username', 'role']);
      const token = auth.signToken(user);
      res.json({ ...user, token });
    } catch (err) {
      next(err);
    }
  };

  return {
    signin,
  };
};

module.exports = authController;
