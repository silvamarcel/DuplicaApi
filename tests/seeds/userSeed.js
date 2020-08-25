const userSeed = ({ getSeed }) => {
  const getNextUser = () => ({
    username: `username_${getSeed()}`,
    password: `pass_${getSeed()}`,
    role: 'user',
  });

  const getNextAdmin = () => ({
    username: `username_${getSeed()}`,
    password: `pass_${getSeed()}`,
    role: 'admin',
  });

  return {
    getNextUser,
    getNextAdmin,
  };
};

module.exports = userSeed;
