const addressSeed = ({ getSeed }) => {
  const getNextAddress = () => {
    const seed = `${getSeed()}`;
    return {
      zipCode: seed,
      address: `Address_${seed}`,
      complement: `Complement_${seed}`,
      neighborhood: `Neighbourhood_${seed}`,
      city: `City_${seed}`,
      state: `State_${seed}`,
    };
  };

  return {
    getNextAddress,
  };
};

module.exports = addressSeed;
