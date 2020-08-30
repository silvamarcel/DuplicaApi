const contactSeed = ({ getSeed }) => {
  const getNextContact = () => {
    const seed = `${getSeed()}`;
    return {
      email: `email_${seed}@test.com`,
      phone: `+612345${seed}`,
    };
  };

  return {
    getNextContact,
  };
};

module.exports = contactSeed;
