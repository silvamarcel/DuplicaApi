const _ = require('lodash');

const factoryService = ({ store }) => {
  const { Factory } = store.models;

  const list = () => Factory.find({}).select('-__v').lean().exec();

  const save = factoryModel =>
    factoryModel
      .save()
      .then(savedFactory =>
        _.pick(savedFactory, [
          '_id',
          'businessId',
          'name',
          'contract',
          'address',
          'contact',
        ]),
      )
      .catch(err => {
        if (err.code === 11000)
          _.merge(err, { message: 'A factory with this name already exists.' });
        throw err;
      });

  const create = factory => save(new Factory(factory));

  const read = id => Factory.findById(id).select('-__v').exec();

  const update = (factoryModel, factoryChanges) => {
    _.merge(factoryModel, factoryChanges);
    return save(factoryModel);
  };

  const del = factoryModel => factoryModel.remove();

  return {
    list,
    create,
    read,
    update,
    delete: del,
  };
};

module.exports = factoryService;
