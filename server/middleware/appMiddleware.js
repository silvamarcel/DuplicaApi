const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const override = require('method-override');
const expressValidator = require('express-validator');

const testing = config => config.env === 'testing';

const middlewares = [];

const addMorgan = () => {
  middlewares.push(morgan('combined', {
    skip: (req, res) => res.statusCode < 400,
    stream: process.stderr,
  }));
  middlewares.push(morgan('combined', {
    skip: (req, res) => res.statusCode >= 400,
    stream: process.stdout,
  }));
};

const addBodyParser = () => {
  middlewares.push(bodyParser.urlencoded({ extended: true }));
  middlewares.push(bodyParser.json());
};

const addValidators = () => {
  middlewares.push(expressValidator());
};

const addRequestsMiddlewares = () => {
  middlewares.push(cors());
  middlewares.push(override());
};

module.exports = ({ config }) => () => {
  if (!testing(config)) addMorgan();
  addBodyParser();
  addValidators();
  addRequestsMiddlewares();
  return middlewares;
};
