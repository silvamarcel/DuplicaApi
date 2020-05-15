let seed = 10000;

const getSeed = () => {
  seed += 1;
  return seed;
};

module.exports = {
  getSeed,
};
