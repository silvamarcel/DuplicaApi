const companySeed = ({ getSeed, getNextAddress, getNextContact }) => {
  const getNextCompany = () => {
    const seed = `${getSeed()}`;
    return {
      businessId: `BusinessId_${seed}`,
      name: `CompanyName_${seed}`,
      bankInformation: {
        branch: '04162',
        account: '700002',
        agreement: '2985981',
        portfolio: '17',
        variation: '43',
        interest: '0.9971',
        instruction1: '03',
        instruction2: '01',
      },
      taxInformation: {
        accumulated: {
          pis: '10.0000',
          cofins: '4.0000',
          irrf: '3.0000',
          iof: '0.0000',
        },
        tax: {
          pis: '0.6500',
          cofins: '3.0000',
          irrf: '0.0000',
          iof: '0.0041',
          additionalIof: '0.3800',
        },
        code: {
          pis: 8109,
          cofins: 2172,
          irrf: 0,
          iof: 6895,
        },
      },
      address: getNextAddress(),
      contact: getNextContact(),
    };
  };

  return {
    getNextCompany,
  };
};

module.exports = companySeed;
