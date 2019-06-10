/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const _ = require('lodash');

const User = require('./userModel');
const appError = require('../../utils/error');
const { signToken } = require('../../auth/auth');

const goNext = (user, req, next) => {
  req.user = user;
  return next();
};

const params = async (req, res, next, id) => {
  await User.findById(id)
    .select('-password -__v')
    .exec()
    .then((user) => {
      if (!user) {
        return next(appError.buildError(null, 403, 'Invalid id'));
      }
      return goNext(user, req, next);
    })
    .catch(appError.catchError(next));
};

const me = async (req, res) => {
  await res.json(req.user);
};

const list = async (req, res, next) => {
  await User.find({})
    .select('-password -__v')
    .exec()
    .then(users => res.json(users))
    .catch(appError.catchError(next));
};

const read = async (req, res, next) => {
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
      return res.json(_.assign(sUser, auth));
    })
    .catch(appError.catchError(next, 'Username already exists.'));
};

const update = async (req, res, next) => {
  const { user } = req;
  const updateUser = req.body;
  _.merge(user, updateUser);
  await save(user, res, next);
};

const create = async (req, res, next) => {
  await save(new User(req.body), res, next);
};

const deleteUser = async (req, res, next) => {
  await req.user.remove()
    .then(removedUser => res.json(removedUser))
    .catch(appError.catchError(next));
};

module.exports = {
  params,
  me,
  list,
  create,
  read,
  update,
  delete: deleteUser,
};
