const factoryController = ({ middleware, services, appError }) => {
  const { factoryService } = services;
  const { OK, CREATED, NO_CONTENT, NOT_FOUND } = appError.statusCodes;

  const params = async (req, res, next, id) => {
    await factoryService
      .read(id)
      .then(factory => {
        if (!factory) {
          return next(
            appError.buildError(null, NOT_FOUND, 'Factory not found'),
          );
        }
        req.factory = factory;
        return next();
      })
      .catch(err => next(err));
  };

  const list = (req, res, next) =>
    factoryService
      .list()
      .then(factories => {
        res.status(OK);
        res.json(factories);
      })
      .catch(err => next(err));

  const create = async (req, res, next) => {
    await middleware.appValidation.validateRequest(req, res);
    await factoryService
      .create(req.body)
      .then(factory => {
        res.status(CREATED);
        res.json(factory);
      })
      .catch(err => next(err));
  };

  const read = (req, res) => {
    return res.json(req.factory);
  };

  const update = async (req, res, next) => {
    await middleware.appValidation.validateRequest(req, res);
    const { factory } = req;
    await factoryService
      .update(factory, req.body)
      .then(updatedFactory => {
        res.status(OK);
        res.json(updatedFactory);
      })
      .catch(err => next(err));
  };

  const deleteFactory = async (req, res, next) => {
    await factoryService
      .delete(req.factory)
      .then(() => {
        res.status(NO_CONTENT);
        res.send();
      })
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
