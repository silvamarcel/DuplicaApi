const has = error => error && error.name;
const is = (error, name) => has(error) && error.name === name;

const buildError = (logger, status = 500, message) => {
  logger.error(`${status} | ${message}`);
  return {
    status,
    message,
  };
};

const verifyJWTErrors = ({ logger, err }) => {
  if (is(err, 'UnauthorizedError')) {
    throw buildError(logger, 401, 'Invalid token');
  }
};

const verifyMongoDBErrors = ({ logger, err }) => {
  if (is(err, 'MongoError')) {
    switch (err.code) {
      case 11000:
        throw buildError(logger, 403, err.message);
      default:
        throw buildError(logger, 500, `Unknown error or not mapped: ${err.message}`);
    }
  }
};

const verifyAPIErrors = ({ logger, err }) => {
  if (has(err) || is(err, 'APIError')) {
    throw buildError(logger, err.status, err.message);
  }
};

const errorHandlingMiddleware = ({ logger }) => (err, req, res, next) => {
  try {
    verifyJWTErrors({ logger, err });
    verifyMongoDBErrors({ logger, err });
    verifyAPIErrors({ logger, err });
    next();
  } catch (error) {
    res.status(error.status);
    res.json({
      error,
    });
  }
};

module.exports = errorHandlingMiddleware;
