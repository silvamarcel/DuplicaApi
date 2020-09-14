/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */
const appError = require('../appError');
const CompanyController = require('./companyController');

const services = {
  companyService: {
    list: jest.fn(),
    create: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};
let companyController;
let middleware;
let req = null;
let res = null;
let next = null;

describe('Company Controller API', () => {
  beforeEach(() => {
    middleware = {
      appValidation: {
        validateRequest: jest.fn(),
      },
    };
    req = jest.fn();
    res = jest.fn();
    next = jest.fn();
    companyController = CompanyController({ middleware, services, appError });
  });

  it('Should throw an error when list gets an error', async () => {
    const error = new Error('Any error!');
    services.companyService.list.mockRejectedValue(error);
    await companyController.list(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should throw an error when delete gets an error', async () => {
    const error = new Error('Any error!');
    services.companyService.delete.mockRejectedValue(error);
    await companyController.delete(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should throw an error when create gets an error', async () => {
    const error = new Error('Any error!');
    services.companyService.create.mockRejectedValue(error);
    await companyController.create(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
