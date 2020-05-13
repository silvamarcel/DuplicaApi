const request = require('supertest');

const get = (app, path, token) => request(app)
  .get(path)
  .set('Authorization', `Bearer ${token}`)
  .set('Accept', 'application/json');

const put = (app, path, object, token) => request(app)
  .put(path)
  .send(object)
  .set('Authorization', `Bearer ${token}`)
  .set('Accept', 'application/json');

const remove = (app, path, token) => request(app)
  .delete(path)
  .send()
  .set('Authorization', `Bearer ${token}`)
  .set('Accept', 'application/json');

const post = (app, path, object, token) => request(app)
  .post(path)
  .send(object)
  .set('Authorization', `Bearer ${token}`)
  .set('Accept', 'application/json');

module.exports = {
  get,
  put,
  remove,
  post,
};
