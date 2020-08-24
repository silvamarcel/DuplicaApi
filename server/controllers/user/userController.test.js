/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */
const appError = require('../appError');
const UserController = require('./userController');

const services = {
  userService: {
    list: jest.fn(),
    create: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};
let userController;
let middleware;
let req = null;
let res = null;
let next = null;

describe('User Controller API', () => {
  beforeEach(() => {
    middleware = {
      appValidation: {
        validateRequest: jest.fn(),
      },
    };
    req = jest.fn();
    res = jest.fn();
    next = jest.fn();
    userController = UserController({ middleware, services, appError });
  });

  it('Should throw an error when list gets an error', async () => {
    const error = new Error('Any error!');
    services.userService.list.mockRejectedValue(error);
    await userController.list(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should throw User not found when user is not defined', async () => {
    req = { userLean: undefined };
    res = { json: jest.fn() };
    next = error => {
      expect(error).toBeDefined();
      expect(error.name).toEqual('APIError');
      expect(error.status).toEqual(404);
      expect(error.message).toEqual('User not found!');
    };
    await userController.read(req, res, next);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('Should throw an error when delete gets an error', async () => {
    const error = new Error('Any error!');
    services.userService.delete.mockRejectedValue(error);
    await userController.delete(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should throw an error when create gets an error', async () => {
    const error = new Error('Any error!');
    services.userService.create.mockRejectedValue(error);
    await userController.create(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
