const factoryController = ({ middleware, services, appError }) => {
  const { factoryService } = services;

  const params = async (req, res, next, id) => {
    await factoryService
      .read(id)
      .then(factory => {
        if (!factory) {
          return next(appError.buildError(null, 403, 'Invalid id'));
        }
        req.factory = factory;
        return next();
      })
      .catch(err => next(err));
  };

  // TODO Improve ability to filter by name
  const list = (req, res, next) =>
    factoryService
      .list()
      .then(factories => res.json(factories))
      .catch(err => next(err));

  const create = async (req, res, next) => {
    await middleware.appValidation.validateRequest(req, res);
    await factoryService
      .create(req.body)
      .then(factory => res.json(factory))
      .catch(err => next(err));
  };

  const read = (req, res, next) => {
    if (!req.factory) {
      return next(appError.buildError(null, 404, 'Factory not found!'));
    }
    return res.json(req.factory);
  };

  const update = async (req, res, next) => {
    await middleware.appValidation.validateRequest(req, res);
    const { factory } = req;
    await factoryService
      .update(factory, req.body)
      .then(updatedFactory => res.json(updatedFactory))
      .catch(err => next(err));
  };

  const deleteFactory = async (req, res, next) => {
    await factoryService
      .delete(req.factory)
      .then(deletedFactory => res.json(deletedFactory))
      .catch(err => next(err));
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
