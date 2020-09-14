/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */
const appError = require('../appError');
const FactoryController = require('./factoryController');

const services = {
  factoryService: {
    list: jest.fn(),
    create: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};
let factoryController;
let middleware;
let req = null;
let res = null;
let next = null;

describe('Factory Controller API', () => {
  beforeEach(() => {
    middleware = {
      appValidation: {
        validateRequest: jest.fn(),
      },
    };
    req = jest.fn();
    res = jest.fn();
    next = jest.fn();
    factoryController = FactoryController({ middleware, services, appError });
  });

  it('Should throw an error when list gets an error', async () => {
    const error = new Error('Any error!');
    services.factoryService.list.mockRejectedValue(error);
    await factoryController.list(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should throw an error when delete gets an error', async () => {
    const error = new Error('Any error!');
    services.factoryService.delete.mockRejectedValue(error);
    await factoryController.delete(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should throw an error when create gets an error', async () => {
    const error = new Error('Any error!');
    services.factoryService.create.mockRejectedValue(error);
    await factoryController.create(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
