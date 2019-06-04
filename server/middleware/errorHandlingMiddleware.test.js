const eh = require('./errorHandlingMiddleware');
const response = require('../../tests/utils/response.mock');

let values;
let res;
let error;
let next;

describe('errorHandling.js', () => {
  beforeEach(() => {
    error = null;
    values = {
      status: null,
      message: null,
    };
    res = response(values);
    next = jest.fn();
  });

  it('Should return 401 UnauthorizedError', () => {
    error = { name: 'UnauthorizedError' };
    eh(error, null, res, next);
    expect(values.status).toEqual(401);
    expect(values.message).toEqual('Invalid token');
  });

  it('Should return MongoError 11000', () => {
    error = {
      code: 11000,
      name: 'MongoError',
      message: 'Any message',
    };
    eh(error, null, res, next);
    expect(values.status).toEqual(403);
    expect(values.message).toEqual('Any message');
  });

  it('Should return an Unknown MongoError', () => {
    error = {
      code: null,
      name: 'MongoError',
      message: 'Any message',
    };
    eh(error, null, res, next);
    expect(values.status).toEqual(500);
    expect(values.message).toEqual('Unknown error or not mapped: Any message');
  });

  it('Should return an APIError with status 402', () => {
    error = {
      status: 402,
      name: 'APIError',
      message: 'Any message',
    };
    eh(error, null, res, next);
    expect(values.status).toEqual(402);
    expect(values.message).toEqual('Any message');
  });

  it('Should return an APIError with status 500 when no status are passed', () => {
    error = {
      name: 'APIError',
      message: 'Any message',
    };
    eh(error, null, res, next);
    expect(values.status).toEqual(500);
    expect(values.message).toEqual('Any message');
  });

  it('Should not return an Error when err is null', () => {
    error = null;
    eh(error, null, res, next);
    expect(next).toHaveBeenCalled();
  });
});
