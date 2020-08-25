const _ = require('lodash');

const userController = ({ middleware, services, appError }) => {
  const { auth } = middleware;
  const { userService } = services;

  const buildSavedUser = savedUser => {
    const user = _.pick(savedUser, ['_id', 'username', 'role']);
    const token = auth.signToken(user);
    return { ...user, token };
  };

  const params = async (req, res, next, id) => {
    await userService
      .read(id)
      .then(user => {
        if (!user) {
          return next(appError.buildError(null, 403, 'Invalid id'));
        }
        req.userModel = user;
        req.leanUser = user.toObject();
        return next();
      })
      .catch(err => next(err));
  };

  const me = (req, res) => {
    return res.json(req.user);
  };

  const list = (req, res, next) =>
    userService
      .list()
      .then(users => res.json(users))
      .catch(err => next(err));

  const create = async (req, res, next) => {
    await middleware.appValidation.validateRequest(req, res);
    await userService
      .create(req.body)
      .then(savedUser => {
        res.json(buildSavedUser(savedUser));
      })
      .catch(err => next(err));
  };

  const read = (req, res, next) => {
    if (!req.leanUser) {
      return next(appError.buildError(null, 404, 'User not found!'));
    }
    return res.json(req.leanUser);
  };

  const update = async (req, res, next) => {
    await middleware.appValidation.validateRequest(req, res);
    const { userModel } = req;
    await userService
      .update(userModel, req.body)
      .then(savedUser => {
        res.json(buildSavedUser(savedUser));
      })
      .catch(err => next(err));
  };

  const deleteUser = async (req, res, next) => {
    await userService
      .delete(req.userModel)
      .then(removedUser => res.json(removedUser))
      .catch(err => next(err));
  };

  const createManagerUser = async data => {
    await userService.create(data).then(savedUser => buildSavedUser(savedUser));
  };

  return {
    params,
    me,
    list,
    create,
    read,
    update,
    delete: deleteUser,
    createManagerUser,
  };
};

module.exports = userController;
