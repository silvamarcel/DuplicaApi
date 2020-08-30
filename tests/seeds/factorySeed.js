const factorySeed = ({ getSeed, getNextAddress, getNextContact }) => {
  const getNextFactory = () => {
    const seed = `${getSeed()}`;
    return {
      businessId: `BusinessId_${seed}`,
      name: `FactoryName_${seed}`,
      contract: `Contract_${seed}`,
      address: getNextAddress(),
      contact: getNextContact(),
    };
  };

  return {
    getNextFactory,
  };
};

module.exports = factorySeed;
