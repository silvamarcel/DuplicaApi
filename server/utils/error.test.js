const error = require('./error');

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
});
