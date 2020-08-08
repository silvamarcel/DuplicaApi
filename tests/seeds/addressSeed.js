const addressSeed = ({ getSeed }) => {
  const getNextAddress = () => ({
    zipCode: getSeed(),
    address: `Address_${getSeed()}`,
    complement: `Complement_${getSeed()}`,
    neighborhood: `Neighbourhood_${getSeed()}`,
    city: `City_${getSeed()}`,
    state: `State_${getSeed()}`,
  });

  return {
    getNextAddress,
  };
};

module.exports = addressSeed;
