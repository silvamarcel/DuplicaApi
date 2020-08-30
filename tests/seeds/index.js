const { getSeed } = require('./seed');
const UserSeed = require('./userSeed');
const AddressSeed = require('./addressSeed');
const ContactSeed = require('./contactSeed');
const CompanySeed = require('./companySeed');
const FactorySeed = require('./factorySeed');

const userSeed = UserSeed({ getSeed });

const { getNextAddress } = AddressSeed({ getSeed });
const { getNextContact } = ContactSeed({ getSeed });
const companySeed = CompanySeed({ getSeed, getNextAddress, getNextContact });
const factorySeed = FactorySeed({ getSeed, getNextAddress, getNextContact });

module.exports = {
  userSeed,
  companySeed,
  factorySeed,
};
