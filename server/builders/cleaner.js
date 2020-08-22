const _ = require('lodash');

module.exports = () => {
  const getCleanedObject = object => {
    if (!object) {
      return object;
    }
    return _.omit(object, ['__v']);
  };

  return {
    getCleanedObject,
  };
};
