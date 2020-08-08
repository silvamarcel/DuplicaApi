const error = require('.');

describe('error.js', () => {
  it('Should build unknown error', () => {
    const status = 400;
    const err = error.buildError(null, status);
    expect(err).toBeDefined();
    expect(err.name).toEqual('APIError');
    expect(err.status).toEqual(status);
    expect(err.message).toEqual('Unknown error');
  });

  it('Should build Any Error', () => {
    const message = 'Any Error';
    const status = 400;
    const err = error.buildError(null, status, message);
    expect(err).toBeDefined();
    expect(err.name).toEqual('APIError');
    expect(err.status).toEqual(status);
    expect(err.message).toEqual(message);
  });

  it('Should build an unknow error without status', () => {
    const err = error.buildError();
    expect(err).toBeDefined();
    expect(err.name).toEqual('APIError');
    expect(err.status).toBeUndefined();
    expect(err.message).toEqual('Unknown error');
  });

  it('Should build a specific error', () => {
    const specificError = new Error('Specific error');
    const status = 403;
    const err = error.buildError(specificError, status);
    expect(err).toBeDefined();
    expect(err.name).toEqual('APIError');
    expect(err.status).toEqual(403);
    expect(err.message).toEqual('Specific error');
  });

  it('Should catch a cast error', done => {
    const err = new Error();
    err.name = 'CastError';
    err.message = 'Error message';
    const next = value => {
      expect(value).toBeDefined();
      expect(value.name).toEqual('APIError');
      expect(value.status).toEqual(403);
      expect(value.message).toEqual('Invalid id');
      done();
    };
    error.catchError(next)(err);
  });

  it('Should catch a existent object error', done => {
    const err = new Error();
    err.code = 11000;
    const next = value => {
      expect(value).toBeDefined();
      expect(value.name).toEqual('Error');
      expect(value.message).toEqual('My error message');
      done();
    };
    error.catchError(next, 'My error message')(err);
  });

  it('Should catch an errorCheck error', done => {
    const err = new Error();
    err.code = 11000;
    err.message = 'My error message';
    const errorCheck = () => new Error('Error check message');
    const next = value => {
      expect(value).toBeDefined();
      expect(value.message).toEqual('Error check message');
      done();
    };
    error.catchError(next, '', errorCheck)(err);
  });
});
