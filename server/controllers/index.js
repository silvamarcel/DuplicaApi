const appError = require('./appError');
const UserController = require('./user/userController');
const FactoryController = require('./factory/factoryController');

module.exports = ({ middleware, services }) => ({
  userController: UserController({ middleware, services, appError }),
  factoryController: FactoryController({ middleware, services, appError }),
});
