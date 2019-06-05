const apiPaths = {
  login: '/auth/signin',
  users: '/api/users',
  factories: '/api/factories',
};

const login = (request, userData = {
  username: 'user',
  password: 'pass',
}) => request.post(apiPaths.login)
  .send(userData)
  .then(response => response.body);

const create = (request, newModel, apiPath) => request.post(apiPath)
  .send(newModel)
  .then(response => response.body);

const createWithToken = (request, newModel, apiPath, token) => request.post(apiPath)
  .set('Authorization', `Bearer ${token}`)
  .send(newModel)
  .then(response => response.body);

const remove = (request, modelId, apiPath, token) => request.delete(`${apiPath}/${modelId}`)
  .set('Authorization', `Bearer ${token}`)
  .then(response => response.body);

module.exports = {
  apiPaths,
  login,
  create,
  createWithToken,
  delete: remove,
};
