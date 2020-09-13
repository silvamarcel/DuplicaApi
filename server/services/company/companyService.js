const _ = require('lodash');

const buildDuplicationErrorMessage = (err, field) => {
  if (err.message.includes(field)) {
    _.merge(err, {
      message: `A company with this ${field} already exists.`,
    });
    throw err;
  }
};

const companyService = ({ store }) => {
  const { Company } = store.models;

  const list = () => Company.find({}).select('-__v').lean().exec();

  const save = companyModel =>
    companyModel
      .save()
      .then(savedCompany =>
        _.pick(savedCompany, [
          '_id',
          'businessId',
          'name',
          'bankInformation',
          'taxInformation',
          'address',
          'contact',
        ]),
      )
      .catch(err => {
        if (err.code === 11000) {
          buildDuplicationErrorMessage(err, 'name');
          buildDuplicationErrorMessage(err, 'businessId');
        }
        throw err;
      });

  const create = company => save(new Company(company));

  const read = id => Company.findById(id).select('-__v').exec();

  const update = (companyModel, companyChanges) => {
    _.merge(companyModel, companyChanges);
    return save(companyModel);
  };

  const del = companyModel => companyModel.remove();

  return {
    list,
    create,
    read,
    update,
    delete: del,
  };
};

module.exports = companyService;
