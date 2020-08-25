const Errors = require('./Errors');

class UnknownError extends Errors {
  constructor({ logger }) {
    super(logger);
    this.logger = logger;
  }

  verify(err) {
    if (this.has(err)) {
      throw this.buildError(500, `Unknown error or not mapped: ${err.message}`);
    }
  }
}

module.exports = UnknownError;
