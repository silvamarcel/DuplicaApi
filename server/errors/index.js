const JWTError = require('./JwtError');
const MongoDBError = require('./MongoDBError');
const ApiError = require('./ApiError');
const UnknownError = require('./UnknownError');

module.exports = ({ logger }) => {
  return {
    jwtError: new JWTError({ logger }),
    mongoDBError: new MongoDBError({ logger }),
    apiError: new ApiError({ logger }),
    unknownError: new UnknownError({ logger }),
  };
};
