const _ = require('lodash');

const userService = ({ store }) => {
  const { User } = store.models;

  const list = () => User.find({}).select('-password -__v').lean().exec();

  const save = async userModel =>
    userModel
      .save()
      .then(savedUser => _.pick(savedUser, ['_id', 'username', 'role']))
      .catch(err => {
        if (err.code === 11000)
          _.merge(err, { message: 'Username already exists.' });
        throw err;
      });

  const create = user => save(new User(user));

  const read = id => User.findById(id).select('-password -__v').exec();

  const update = (userModel, userChanges) => {
    _.merge(userModel, userChanges);
    return save(userModel);
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

module.exports = userService;
