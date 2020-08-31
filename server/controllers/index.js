const appError = require('./appError');
const UserController = require('./user/userController');
const CompanyController = require('./company/companyController');
const FactoryController = require('./factory/factoryController');

module.exports = ({ middleware, services }) => ({
  userController: UserController({ middleware, services, appError }),
  companyController: CompanyController({ middleware, services, appError }),
  factoryController: FactoryController({ middleware, services, appError }),
});
