/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const request = require('supertest');
const app = require('../server');
const userUtil = require('../../tests/utils/util.user.integration');
const setup = require('../../tests/setup');

describe('Authentication API', () => {
  beforeAll(async () => {
    await setup.init();
  });

  afterAll((done) => {
    setup.close(done);
  });

  it('Should signin', async (done) => {
    const user = {
      username: 'username_auth_001',
      password: 'pass',
    };
    const createdUser = await userUtil.createUser(request(app), user);
    await request(app)
      .post('/auth/signin')
      .send(user)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        const loggedUser = response.body;
        expect(loggedUser).toBeDefined();
        expect(loggedUser._id).toEqual(createdUser._id);
        expect(loggedUser.username).toEqual(createdUser.username);
        expect(loggedUser.token).toBeDefined();
        done();
      });
  });

  it('Should not signin and receive invalid username and/or password', async (done) => {
    const user = {
      username: 'username_auth_002',
      password: 'pass',
    };
    await userUtil.createUser(request(app), user);
    user.password = 'wrongPass';
    await request(app)
      .post('/auth/signin')
      .send(user)
      .set('Accept', 'application/json')
      .expect(401)
      .then((response) => {
        expect(response.error).toBeDefined();
        expect(response.error.text).toEqual('Invalid username and/or password');
        done();
      });
  });

  it('Should not signin and receive you need an username and password', async (done) => {
    const user = {
      username: 'username_auth_003',
      password: null,
    };
    await request(app)
      .post('/auth/signin')
      .send(user)
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        expect(response.error).toBeDefined();
        expect(response.error.text).toEqual('You need an username and password');
        done();
      });
  });

  it('Should always validate the token', async (done) => {
    const user = {
      username: 'username_auth_004',
      password: 'pass',
    };
    const createdUser = await userUtil.createUser(request(app), user);
    await request(app)
      .get('/api/users/me')
      .set('Accept', 'application/json')
      .query({ access_token: createdUser.token })
      .expect(200)
      .then((response) => {
        const me = response.body;
        expect(me).toBeDefined();
        expect(me._id).toEqual(createdUser._id);
        expect(me.username).toEqual(createdUser.username);
        done();
      });
  });

  it('Should return Invalid id when try to access with a deleted user', async (done) => {
    const user = {
      username: 'username_auth_005',
      password: 'pass',
    };
    const createdUser = await userUtil.createUser(request(app), user);
    await userUtil.deleteUser(request(app), createdUser);
    await request(app)
      .get(`/api/users/${createdUser._id}`)
      .set('Accept', 'application/json')
      .query({ access_token: createdUser.token })
      .expect(403)
      .then((response) => {
        expect(response.text).toEqual('Invalid id');
        done();
      });
  });
});
