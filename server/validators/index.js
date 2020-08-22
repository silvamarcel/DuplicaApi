const userValidator = require('./user/userValidator');
const factoryValidator = require('./factory/factoryValidator');

module.exports = () => ({
  userValidator,
  factoryValidator,
});
