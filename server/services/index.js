const UserService = require('./user/userService');
const FactoryService = require('./factory/factoryService');

module.exports = ({ store }) => ({
  userService: UserService({ store }),
  factoryService: FactoryService({ store }),
});
