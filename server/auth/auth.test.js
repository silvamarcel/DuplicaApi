/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */
const mockingoose = require('mockingoose').default;
require('../api/user/userModel');
const auth = require('./auth');

describe('Authentication API', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('Should get fresh user', async () => {
    const _doc = {
      _id: '5b4cbf243edc0395b98184f1',
    };
    mockingoose.users.toReturn(_doc, 'findOne');

    const req = { user: _doc };
    const res = jest.fn();
    const next = jest.fn();

    const getFreshUser = auth.getFreshUser();
    await getFreshUser(req, res, next);

    expect(res).not.toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user._id.toString()).toEqual(_doc._id);
    expect(next).toHaveBeenCalled();
  });

  it('Should return status 400 and Unauthorized', async () => {
    const _doc = undefined;
    const user = {
      _id: '5b4cbf243edc0395b98184f2',
    };
    mockingoose.users.toReturn(_doc, 'findOne');

    let status = null;
    let text = null;
    const req = { user };
    const res = {
      status: (s) => {
        status = s;
        return {
          send: (t) => {
            text = t;
          },
        };
      },
    };
    const next = jest.fn();
    await auth.getFreshUser()(req, res, next);
    expect(status).toEqual(400);
    expect(text).toEqual('Unauthorized');
  });

  it('Should call next with err when User.findById throws an error on getFreshUser', async () => {
    const error = new Error('Any Error!');
    mockingoose.users.toReturn(error, 'findOne');

    const user = {
      _id: '5b4cbf243edc0395b98184f3',
    };
    const req = { user };
    const res = jest.fn();
    const next = jest.fn();

    const getFreshUser = await auth.getFreshUser();
    await getFreshUser(req, res, next);

    expect(res).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should call next with err when User.findOne throws an error on verifyUser', async () => {
    const error = new Error('Any Error!');
    mockingoose.users.toReturn(error, 'findOne');

    const body = {
      username: 'myUsername',
      password: 'myPassword',
    };
    const req = { body };
    const res = jest.fn();
    const next = jest.fn();

    const verifyUser = await auth.verifyUser();
    await verifyUser(req, res, next);

    expect(res).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
