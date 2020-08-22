const Errors = require('./Errors');

class MongoDBError extends Errors {
  constructor({ logger }) {
    super(logger);
    this.logger = logger;
  }

  verify(err) {
    if (this.is(err, 'MongoError')) {
      switch (err.code) {
        case 11000:
          throw this.buildError(403, err.message);
        default:
          throw this.buildError(
            500,
            `Unknown error or not mapped: ${err.message}`,
          );
      }
    }
    if (this.is(err, 'CastError')) {
      throw this.buildError(403, 'Invalid id');
    }
  }
}

module.exports = MongoDBError;
