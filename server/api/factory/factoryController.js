/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const _ = require('lodash');

const Factory = require('./factoryModel');

const factoryController = ({ middleware, appError, auth }) => {
  const goNext = (factory, req, next) => {
    req.factory = factory;
    return next();
  };

  const params = async (req, res, next, id) => {
    await Factory.findById(id)
      .select('-__v')
      .exec()
      .then((factory) => {
        if (!factory) {
          return next(appError.buildError(null, 403, 'Invalid id'));
        }
        return goNext(factory, req, next);
      })
      .catch(appError.catchError(next));
  };

  // TODO Improve ability to filter by name
  const list = async (req, res, next) => {
    await Factory.find({})
      .select('-__v')
      .exec()
      .then(factories => res.json(factories))
      .catch(appError.catchError(next));
  };

  const save = async (factory, user, res, next) => {
    await factory.save()
      .then((savedFactory) => {
        const sFactory = _.pick(savedFactory, ['_id', 'name']);
        const token = auth.signToken(user);
        return res.json(_.assign(sFactory, { token }));
      })
      .catch(appError.catchError(next, 'A factory with this name already exists.'));
  };

  const create = async (req, res, next) => {
    await middleware.appValidation.validateRequest(req, res);
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
    await middleware.appValidation.validateRequest(req, res);
    const { factory, user } = req;
    const updatedFactory = req.body;
    _.merge(factory, updatedFactory);
    await save(factory, user, res, next);
  };

  const deleteFactory = async (req, res, next) => {
    await req.factory.remove()
      .then(removedFactory => res.json(removedFactory))
      .catch(appError.catchError(next));
  };

  return {
    params,
    list,
    create,
    read,
    update,
    delete: deleteFactory,
  };
};

module.exports = factoryController;
