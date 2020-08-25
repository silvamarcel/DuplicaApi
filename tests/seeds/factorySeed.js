const factorySeed = ({ getSeed, getNextAddress, getNextContact }) => {
  const getNextFactory = () => ({
    businessId: `BusinessId_${getSeed()}`,
    name: `FactoryName_${getSeed()}`,
    contract: `Contract_${getSeed()}`,
    address: getNextAddress(),
    contact: getNextContact(),
  });

  return {
    getNextFactory,
  };
};

module.exports = factorySeed;
