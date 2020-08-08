const config = require('../../server/config/config');

const { userManager, passManager } = config;

const apiPaths = {
  login: '/auth/signin',
  users: '/api/users',
  factories: '/api/factories',
};

const login = (
  request,
  userData = {
    username: 'user',
    password: 'pass',
  },
) =>
  request
    .post(apiPaths.login)
    .send(userData)
    .then(response => response.body);

const getAdminUser = request =>
  login(request, {
    username: userManager,
    password: passManager,
  });

const create = async (request, newModel, apiPath, token) => {
  const admin = await getAdminUser(request);
  const bearerToken = token || admin.token;
  return request
    .post(apiPath)
    .set('Authorization', `Bearer ${bearerToken}`)
    .send(newModel)
    .then(response => response.body);
};

const remove = (request, modelId, apiPath, token) =>
  request
    .delete(`${apiPath}/${modelId}`)
    .set('Authorization', `Bearer ${token}`)
    .then(response => response.body);

module.exports = {
  apiPaths,
  login,
  getAdminUser,
  create,
  delete: remove,
};
