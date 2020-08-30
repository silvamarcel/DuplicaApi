const userValidator = require('./user/userValidator');
const companyValidator = require('./company/companyValidator');
const factoryValidator = require('./factory/factoryValidator');

module.exports = () => ({
  userValidator,
  companyValidator,
  factoryValidator,
});
