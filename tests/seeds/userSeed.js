const userSeed = ({ getSeed }) => {
  const getNextUser = () => {
    const seed = `${getSeed()}`;
    return {
      username: `username_${seed}`,
      password: `pass_${seed}`,
      role: 'user',
    };
  };

  const getNextAdmin = () => {
    const seed = `${getSeed()}`;
    return {
      username: `username_${seed}`,
      password: `pass_${seed}`,
      role: 'admin',
    };
  };

  return {
    getNextUser,
    getNextAdmin,
  };
};

module.exports = userSeed;
