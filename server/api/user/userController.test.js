/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */
const mockingoose = require('mockingoose').default;
const appError = require('../../error');
const auth = require('../../auth');
const UserController = require('./userController');

let userController;
let middleware;
let req = null;
let res = null;
let next = null;

describe('User Controller API', () => {
  beforeEach(() => {
    mockingoose.resetAll();
    middleware = {
      appValidation: {
        validateRequest: jest.fn(),
      },
    };
    req = jest.fn();
    res = jest.fn();
    next = jest.fn();
    userController = UserController({ middleware, appError, auth });
  });

  it('Should return an error APIError with status 403 and Invalid id when an CastError occurs', async () => {
    const castError = new Error('Invalid id');
    castError.name = 'CastError';
    mockingoose.users.toReturn(castError, 'findOne');

    next = error => {
      expect(error).toBeDefined();
      expect(error.name).toEqual('APIError');
      expect(error.status).toEqual(403);
      expect(error.message).toEqual('Invalid id');
    };
    const id = 'myId';

    await userController.params(req, res, next, id);
  });

  it('Should return an error when  an generic error occurs', async () => {
    const genericError = new Error('Any error');
    genericError.name = 'Error';
    mockingoose.users.toReturn(genericError, 'findOne');

    next = error => {
      expect(error).toBeDefined();
      expect(error).toEqual(genericError);
    };
    const id = 'myId';
    await userController.params(req, res, next, id);
  });

  it('Should return the error when list throws an error', async () => {
    const error = new Error('Any error!');
    mockingoose.users.toReturn(error, 'find');
    await userController.list(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should return User not found when user is not defined', async () => {
    req = { userModel: undefined };
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

  it('Should return the error when User.delete throws an error', async () => {
    const error = new Error('Any error!');
    const remove = jest.fn(() => Promise.reject(error));

    req = { userModel: { remove } };
    res = jest.fn();
    next = jest.fn();
    await userController.delete(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should return an error when user.save throws an generic error', async () => {
    const genericError = new Error('Any error!');
    mockingoose.users.toReturn(genericError, 'save');

    req = {
      body: { username: 'myUsername', password: 'myPassword', role: 'myRole' },
    };
    next = error => {
      expect(error).toBeDefined();
      expect(error).toEqual(genericError);
    };
    await userController.create(req, res, next);
  });
});
