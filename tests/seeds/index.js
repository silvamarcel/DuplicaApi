const { getSeed } = require('./seed');
const AddressSeed = require('./addressSeed');
const ContactSeed = require('./contactSeed');
const FactorySeed = require('./factorySeed');

const { getNextAddress } = AddressSeed({ getSeed });
const { getNextContact } = ContactSeed({ getSeed });
const factorySeed = FactorySeed({ getSeed, getNextAddress, getNextContact });

module.exports = {
  factorySeed,
};
