const errorHandlingMiddleware = ({ errors }) => (err, req, res, next) => {
  try {
    const { jwtError, mongoDBError, apiError, unknownError } = errors;
    jwtError.verify(err);
    mongoDBError.verify(err);
    apiError.verify(err);
    unknownError.verify(err);
    next();
  } catch (error) {
    res.status(error.status);
    res.json({
      error,
    });
  }
};

module.exports = errorHandlingMiddleware;
