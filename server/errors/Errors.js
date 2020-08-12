class Errors {
  constructor(logger) {
    this.logger = logger;
    this.error = null;
  }

  has(error) {
    this.error = error;
    return error && error.name;
  }

  is(error, name) {
    return this.has(error) && error.name === name;
  }

  buildError(status = 500, message) {
    this.logger.error(`${status} | ${message}`);
    return {
      status,
      message,
    };
  }

  verify(error) {
    this.error = error;
    throw new Error('You have to implement the method verify!');
  }
}

module.exports = Errors;
