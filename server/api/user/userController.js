/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const _ = require('lodash');

const User = require('./userModel');
const appError = require('../../utils/error');
const { signToken } = require('../../auth/auth');

const params = async (req, res, next, id) => {
  await User.findById(id)
    .select('-password -__v')
    .exec()
    .then((user) => {
      if (!user) {
        next(appError.buildError(null, 403, 'Invalid id'));
      } else {
        req.user = user;
        next();
      }
    })
    .catch((err) => {
      let error = err;
      if (err.name === 'CastError') {
        error = appError.buildError(err, 403, 'Invalid id');
      }
      next(error);
    });
};

const me = async (req, res) => {
  await res.json(req.user);
};

const get = async (req, res, next) => {
  await User.find({})
    .select('-password -__v')
    .exec()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      next(err);
    });
};

const getOne = async (req, res, next) => {
  if (!req.user) {
    await next(appError.buildError(null, 404, 'User not found!'));
  } else {
    await res.json(req.user);
  }
};

const save = async (user, res, next) => {
  await user.save()
    .then((savedUser) => {
      const sUser = _.pick(savedUser, ['_id', 'username']);
      const token = signToken(sUser._id);
      const auth = { token };
      res.json(_.assign(sUser, auth));
    })
    .catch((err) => {
      const error = err;
      if (error && error.code === 11000) {
        error.message = 'Username already exists.';
      }
      next(error);
    });
};

const put = async (req, res, next) => {
  const { user } = req;
  const update = req.body;
  _.merge(user, update);
  await save(user, res, next);
};

const post = async (req, res, next) => {
  await save(new User(req.body), res, next);
};

const deleteUser = async (req, res, next) => {
  await req.user.remove()
    .then((removedUser) => {
      res.json(removedUser);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  params,
  me,
  get,
  getOne,
  put,
  post,
  delete: deleteUser,
};
