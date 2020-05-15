const contactSeed = ({ getSeed }) => {
  const getNextContact = () => ({
    email: `email_${getSeed()}@test.com`,
    phone: `+612345${getSeed()}`,
  });

  return {
    getNextContact,
  };
};


module.exports = contactSeed;
