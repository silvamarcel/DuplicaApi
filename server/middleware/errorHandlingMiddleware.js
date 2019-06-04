const logger = require('../utils/logger');

let error = null;

const setError = (status, message) => {
  error = {
    status,
    message,
  };
};

const verifyJWTErrors = (err) => {
  if (err && err.name === 'UnauthorizedError') {
    setError(401, 'Invalid token');
  }
};

const verifyMongoDBErrors = (err) => {
  if (error == null && err && err.name && err.name === 'MongoError') {
    switch (err.code) {
      case 11000:
        setError(403, err.message);
        break;
      default:
        setError(500, `Unknown error or not mapped: ${err.message}`);
        break;
    }
    logger.error(err);
  }
};

const verifyAPIErrors = (err) => {
  if (error == null && err && err.name && err.name === 'APIError') {
    if (err.status) {
      setError(err.status, err.message);
    } else {
      setError(500, err.message);
    }
    logger.error(err);
  }
};

module.exports = (err, req, res, next) => {
  error = null;
  verifyJWTErrors(err);
  verifyMongoDBErrors(err);
  verifyAPIErrors(err);
  if (error) {
    res.status(error.status).send(error.message);
  } else {
    next();
  }
};
