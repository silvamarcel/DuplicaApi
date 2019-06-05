/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const _ = require('lodash');

const Factory = require('./factoryModel');
const appError = require('../../utils/error');
const { signToken } = require('../../auth/auth');

const params = async (req, res, next, id) => {
  await Factory.findById(id)
    .select('-__v')
    .exec()
    .then((factory) => {
      if (!factory) {
        next(appError.buildError(null, 403, 'Invalid id'));
      } else {
        req.factory = factory;
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

// TODO Improve ability to filter by name
const list = async (req, res, next) => {
  await Factory.find({})
    .select('-__v')
    .exec()
    .then((factories) => {
      res.json(factories);
    })
    .catch((err) => {
      next(err);
    });
};

const save = async (factory, user, res, next) => {
  await factory.save()
    .then((savedFactory) => {
      const sFactory = _.pick(savedFactory, ['_id', 'name']);
      const token = signToken(user._id);
      const auth = { token };
      res.json(_.assign(sFactory, auth));
    })
    .catch((err) => {
      const error = err;
      if (error && error.code === 11000) {
        error.message = 'A factory with this name already exists.';
      }
      next(error);
    });
};

const create = async (req, res, next) => {
  await save(new Factory(req.body), req.user, res, next);
};

const read = async (req, res, next) => {
  if (!req.factory) {
    await next(appError.buildError(null, 404, 'Factory not found!'));
  } else {
    await res.json(req.factory);
  }
};

const update = async (req, res, next) => {
  const { factory, user } = req;
  const updatedFactory = req.body;
  _.merge(factory, updatedFactory);
  await save(factory, user, res, next);
};

const deleteFactory = async (req, res, next) => {
  await req.factory.remove()
    .then((removedUser) => {
      res.json(removedUser);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  params,
  list,
  create,
  read,
  update,
  delete: deleteFactory,
};
