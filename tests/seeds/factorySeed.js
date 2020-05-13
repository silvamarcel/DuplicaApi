let factorySeed = 10000;

const getNextFactory = () => {
  factorySeed += 1;
  const factory = {
    businessId: `BusinessId_${factorySeed}`,
    name: `FactoryName_${factorySeed}`,
    contract: `Contract_${factorySeed}`,
  };
  return factory;
};

module.exports = {
  getNextFactory,
};
