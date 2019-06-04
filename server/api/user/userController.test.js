/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */
const mockingoose = require('mockingoose').default;
const userController = require('./userController');

describe('User Controller API', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('Should return an error APIError with status 403 and Invalid id when an CastError occurs', async () => {
    const castError = new Error('Invalid id');
    castError.name = 'CastError';
    mockingoose.users.toReturn(castError, 'findOne');

    const req = jest.fn();
    const res = jest.fn();
    const next = (error) => {
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

    const req = jest.fn();
    const res = jest.fn();
    const next = (error) => {
      expect(error).toBeDefined();
      expect(error).toEqual(genericError);
    };
    const id = 'myId';
    await userController.params(req, res, next, id);
  });

  it('Should return the error when User.find throws an error', async () => {
    const error = new Error('Any error!');
    mockingoose.users.toReturn(error, 'find');
    const req = jest.fn();
    const res = jest.fn();
    const next = jest.fn();
    await userController.get(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should return User not found when user is not defined', async () => {
    const req = { user: undefined };
    const res = { json: jest.fn() };
    const next = (error) => {
      expect(error).toBeDefined();
      expect(error.name).toEqual('APIError');
      expect(error.status).toEqual(404);
      expect(error.message).toEqual('User not found!');
    };
    await userController.getOne(req, res, next);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('Should return the error when User.delete throws an error', async () => {
    const error = new Error('Any error!');
    const remove = jest.fn(() => Promise.reject(error));

    const req = { user: { remove } };
    const res = jest.fn();
    const next = jest.fn();
    await userController.delete(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should return an error when user.save throws an generic error', async () => {
    const genericError = new Error('Any error!');
    mockingoose.users.toReturn(genericError, 'save');
    const req = {
      body: { username: 'myUsername', password: 'myPassword' },
    };
    const res = jest.fn();
    const next = (error) => {
      expect(error).toBeDefined();
      expect(error).toEqual(genericError);
    };
    await userController.post(req, res, next);
  });
});
