/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */
const mockingoose = require('mockingoose').default;
const appError = require('../../error');
const auth = require('../../auth');
const FactoryController = require('./factoryController');

let factoryController;
let middleware;
let req = null;
let res = null;
let next = null;

describe('Factory Controller API', () => {
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
    factoryController = FactoryController({ middleware, appError, auth });
  });

  it('Should return an error APIError with status 403 and Invalid id when an CastError occurs', async () => {
    const castError = new Error('Invalid id');
    castError.name = 'CastError';
    mockingoose.factories.toReturn(castError, 'findOne');

    next = (error) => {
      expect(error).toBeDefined();
      expect(error.name).toEqual('APIError');
      expect(error.status).toEqual(403);
      expect(error.message).toEqual('Invalid id');
    };
    const id = 'myId';

    await factoryController.params(req, res, next, id);
  });

  it('Should return an error when an generic error occurs', async () => {
    const genericError = new Error('Any error');
    genericError.name = 'Error';
    mockingoose.factories.toReturn(genericError, 'findOne');

    next = (error) => {
      expect(error).toBeDefined();
      expect(error).toEqual(genericError);
    };
    const id = 'myId';
    await factoryController.params(req, res, next, id);
  });

  it('Should return the error when list throws an error', async () => {
    const error = new Error('Any error!');
    mockingoose.factories.toReturn(error, 'find');
    await factoryController.list(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should return Factory not found when user is not defined', async () => {
    req = { factory: undefined };
    res = { json: jest.fn() };
    next = (error) => {
      expect(error).toBeDefined();
      expect(error.name).toEqual('APIError');
      expect(error.status).toEqual(404);
      expect(error.message).toEqual('Factory not found!');
    };
    await factoryController.read(req, res, next);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('Should return the error when delete throws an error', async () => {
    const error = new Error('Any error!');
    const remove = jest.fn(() => Promise.reject(error));

    req = { factory: { remove } };
    res = jest.fn();
    next = jest.fn();
    await factoryController.delete(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should return an error when create throws an generic error', async () => {
    const genericError = new Error('Any error!');
    mockingoose.factories.toReturn(genericError, 'save');
    req = {
      body: { name: 'myFactory' },
    };
    next = (error) => {
      expect(error).toBeDefined();
      expect(error).toEqual(genericError);
    };
    await factoryController.create(req, res, next);
  });
});
