/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../config/config');
const appError = require('../error');
const User = require('../api/user/userModel');

const { secrets, expireTime } = config;

const checkToken = expressJwt({
  secret: secrets.jwt,
  algorithms: ['HS256'],
});

const decodeToken = () => (req, res, next) => {
  if (
    req.query &&
    Object.prototype.hasOwnProperty.call(req.query, 'access_token')
  ) {
    req.headers.authorization = `Bearer ${req.query.access_token}`;
  }
  checkToken(req, res, next);
};

const signToken = ({ _id, username, role }) =>
  jwt.sign({ _id, username, role }, secrets.jwt, {
    expiresIn: expireTime,
  });

const goNext = (user, req, next) => {
  req.user = user;
  return next();
};

const errorStatus = (res, code, message) => {
  res.status(code).send({ error: message });
  return null;
};

const getFreshUser = () => (req, res, next) =>
  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        return errorStatus(res, 401, 'Unauthorized');
      }
      return goNext(user, req, next);
    })
    .catch(appError.catchError(next));

const verifyUser = () => (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return errorStatus(res, 400, 'You need an username and password');
  }
  return User.findOne({ username })
    .then(user => {
      if (!user || !user.authenticate(password)) {
        return errorStatus(res, 401, 'Invalid username and/or password');
      }
      return goNext(user, req, next);
    })
    .catch(appError.catchError(next));
};

module.exports = {
  decodeToken,
  signToken,
  getFreshUser,
  verifyUser,
};
