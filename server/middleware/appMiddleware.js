const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const override = require('method-override');

const config = require('../config/config');

const testing = () => config.env === 'testing';

module.exports = (app) => {
  if (!testing) {
    app.use(morgan('combined', {
      skip: (req, res) => res.statusCode < 400,
      stream: process.stderr,
    }));
    app.use(morgan('combined', {
      skip: (req, res) => res.statusCode >= 400,
      stream: process.stdout,
    }));
  }
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(override());
};
