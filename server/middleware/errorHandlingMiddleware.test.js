const { initConfig } = require('../../tests/setup');

const logger = require('../log/logger')({ config: initConfig() });
const errors = require('../errors')({ logger });
const errorHandlingMiddleware = require('./errorHandlingMiddleware')({
  errors,
});
const response = require('../../tests/utils/response.mock');

let values;
let res;
let error;
let next;

describe('Error Handling Middleware', () => {
  beforeEach(() => {
    error = null;
    values = {
      status: null,
      message: null,
    };
    res = response(values);
    next = jest.fn();
  });

  it('Should not return an Error when err is null', () => {
    error = null;
    errorHandlingMiddleware(error, null, res, next);
    expect(next).toHaveBeenCalled();
  });
});
