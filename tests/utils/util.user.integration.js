/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const createUser = (request, newUser) => request.post('/api/users')
  .send(newUser)
  .then(response => response.body);

const deleteUser = (request, user) => request.delete(`/api/users/${user._id}`)
  .set('Authorization', `Bearer ${user.token}`)
  .then(response => response.body);

module.exports = {
  createUser,
  deleteUser,
};
