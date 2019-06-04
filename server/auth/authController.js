/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const _ = require('lodash');
const { signToken } = require('../auth/auth');

exports.signin = (req, res, next) => {
  try {
    const user = _.pick(req.user, ['_id', 'username']);
    const token = signToken(user._id);
    const auth = { token };
    res.json(_.merge(auth, user));
  } catch (err) {
    next(err);
  }
};
