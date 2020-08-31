const companyController = ({ middleware, services, appError }) => {
  const { companyService } = services;

  const params = async (req, res, next, id) => {
    await companyService
      .read(id)
      .then(company => {
        if (!company) {
          return next(appError.buildError(null, 403, 'Invalid id'));
        }
        req.company = company;
        return next();
      })
      .catch(err => next(err));
  };

  const list = (req, res, next) =>
    companyService
      .list()
      .then(companies => res.json(companies))
      .catch(err => next(err));

  const create = async (req, res, next) => {
    await middleware.appValidation.validateRequest(req, res);
    await companyService
      .create(req.body)
      .then(company => res.json(company))
      .catch(err => next(err));
  };

  const read = (req, res, next) => {
    if (!req.company) {
      return next(appError.buildError(null, 404, 'Company not found!'));
    }
    return res.json(req.company);
  };

  const update = async (req, res, next) => {
    await middleware.appValidation.validateRequest(req, res);
    const { company } = req;
    await companyService
      .update(company, req.body)
      .then(updatedCompany => res.json(updatedCompany))
      .catch(err => next(err));
  };

  const deleteCompany = async (req, res, next) => {
    await companyService
      .delete(req.company)
      .then(deletedCompany => res.json(deletedCompany))
      .catch(err => next(err));
  };

  return {
    params,
    list,
    create,
    read,
    update,
    delete: deleteCompany,
  };
};

module.exports = companyController;
