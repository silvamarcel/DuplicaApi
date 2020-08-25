const { initConfig } = require('../../tests/setup');
const testLogger = require('../log/logger')({ config: initConfig() });
const Errors = require('./Errors');
const { apiError, mongoDBError, jwtError, unknownError } = require('.')({
  logger: testLogger,
});

class ErrorsTest extends Errors {
  constructor({ logger }) {
    super(logger);
    this.logger = logger;
  }
}

const validateError = (errorClass, error, expectedError) => {
  expect.assertions(1);
  try {
    errorClass.verify(error);
  } catch (err) {
    expect(err).toEqual(expectedError);
  }
};

describe('Errors', () => {
  it("Should return the Error 'You have to implement the method verify!'", () => {
    const errorsTest = new ErrorsTest({ logger: testLogger });
    const error = 'Any error!!!';
    const expectedError = Error('You have to implement the method verify!');
    validateError(errorsTest, error, expectedError);
  });

  it('Should return an Unknown Error', () => {
    const error = { name: 'Unknown error', message: 'Any error!' };
    const expectedError = {
      message: 'Unknown error or not mapped: Any error!',
      status: 500,
    };
    validateError(unknownError, error, expectedError);
  });

  it('Should return JWTError with 401 UnauthorizedError', () => {
    const error = { name: 'UnauthorizedError', message: 'Any error!' };
    const expectedError = {
      message: 'Invalid token',
      status: 401,
    };
    validateError(jwtError, error, expectedError);
  });

  it('Should return MongoError for code 11000', () => {
    const error = {
      code: 11000,
      name: 'MongoError',
      message: 'Any message',
    };
    const expectedError = {
      message: 'Any message',
      status: 403,
    };
    validateError(mongoDBError, error, expectedError);
  });

  it('Should return an Unknown MongoError', () => {
    const error = {
      code: null,
      name: 'MongoError',
      message: 'Any message',
    };
    const expectedError = {
      message: 'Unknown error or not mapped: Any message',
      status: 500,
    };
    validateError(mongoDBError, error, expectedError);
  });

  it('Should return an APIError with status 402', () => {
    const error = {
      status: 402,
      name: 'APIError',
      message: 'Any message',
    };
    const expectedError = {
      message: 'Any message',
      status: 402,
    };
    validateError(apiError, error, expectedError);
  });

  it('Should return an APIError with status 500 when no status are passed', () => {
    const error = {
      name: 'APIError',
      message: 'Any message',
    };
    const expectedError = {
      message: 'Any message',
      status: 500,
    };
    validateError(apiError, error, expectedError);
  });
});
