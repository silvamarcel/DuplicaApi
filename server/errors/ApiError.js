const Errors = require('./Errors');

class ApiError extends Errors {
  constructor({ logger }) {
    super(logger);
    this.logger = logger;
  }

  verify(error) {
    if (this.has(error) || this.is(error, 'APIError')) {
      throw this.buildError(error.status, error.message);
    }
  }
}

module.exports = ApiError;
