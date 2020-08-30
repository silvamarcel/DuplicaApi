const UserService = require('./user/userService');
const CompanyService = require('./company/companyService');
const FactoryService = require('./factory/factoryService');

module.exports = ({ store }) => ({
  userService: UserService({ store }),
  companyService: CompanyService({ store }),
  factoryService: FactoryService({ store }),
});
