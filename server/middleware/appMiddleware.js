const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const override = require('method-override');
const expressValidator = require('express-validator');

const config = require('../config/config');

const testing = () => config.env === 'testing';

const addMorgan = (app) => {
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400,
    stream: process.stderr,
  }));
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode >= 400,
    stream: process.stdout,
  }));
};

const addBodyParser = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
};

const addValidators = (app) => {
  app.use(expressValidator());
};

const addRequestsMiddlewares = (app) => {
  app.use(cors());
  app.use(override());
}

module.exports = (app) => {
  if (!testing) addMorgan(app);
  addBodyParser(app);
  addValidators(app);
  addRequestsMiddlewares(app);
};
