const { getSeed } = require('./seed');
const UserSeed = require('./userSeed');
const AddressSeed = require('./addressSeed');
const ContactSeed = require('./contactSeed');
const FactorySeed = require('./factorySeed');

const userSeed = UserSeed({ getSeed });

const { getNextAddress } = AddressSeed({ getSeed });
const { getNextContact } = ContactSeed({ getSeed });
const factorySeed = FactorySeed({ getSeed, getNextAddress, getNextContact });

module.exports = {
  userSeed,
  factorySeed,
};
