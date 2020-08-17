const R = require('ramda');

module.exports = () => {
  const getCleanedObject = object => {
    if (!object) {
      return object;
    }
    return R.omit(['__v'], object);
  };

  return {
    getCleanedObject,
  };
};
