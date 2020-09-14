const companyController = ({ middleware, services, appError }) => {
  const { companyService } = services;
  const { OK, CREATED, NO_CONTENT, NOT_FOUND } = appError.statusCodes;

  const params = async (req, res, next, id) => {
    await companyService
      .read(id)
      .then(company => {
        if (!company) {
          return next(
            appError.buildError(null, NOT_FOUND, 'Company not found'),
          );
        }
        req.company = company;
        return next();
      })
      .catch(err => next(err));
  };

  const list = (req, res, next) =>
    companyService
      .list()
      .then(companies => {
        res.status(OK);
        res.json(companies);
      })
      .catch(err => next(err));

  const create = async (req, res, next) => {
    await middleware.appValidation.validateRequest(req, res);
    await companyService
      .create(req.body)
      .then(company => {
        res.status(CREATED);
        res.json(company);
      })
      .catch(err => next(err));
  };

  const read = (req, res) => {
    return res.json(req.company);
  };

  const update = async (req, res, next) => {
    await middleware.appValidation.validateRequest(req, res);
    const { company } = req;
    await companyService
      .update(company, req.body)
      .then(updatedCompany => {
        res.status(OK);
        res.json(updatedCompany);
      })
      .catch(err => next(err));
  };

  const deleteCompany = async (req, res, next) => {
    await companyService
      .delete(req.company)
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
    delete: deleteCompany,
  };
};

module.exports = companyController;
