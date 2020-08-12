const Errors = require('./Errors');

class JWTError extends Errors {
  constructor({ logger }) {
    super(logger);
    this.logger = logger;
  }

  verify(err) {
    if (this.is(err, 'UnauthorizedError')) {
      throw this.buildError(401, 'Invalid token');
    }
  }
}

module.exports = JWTError;
