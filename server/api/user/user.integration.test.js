/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const request = require('supertest');
const app = require('../../server');
const modelUtil = require('../../../tests/utils/util.model.integration');
const setup = require('../../../tests/setup');

let admin;

const createUser = user => modelUtil.create(
  request(app),
  user,
  modelUtil.apiPaths.users,
);

describe('User API', () => {
  beforeAll(async () => {
    await setup.init();
    admin = await modelUtil.getAdminUser(request(app));
  });

  afterAll((done) => {
    setup.close(done);
  });

  it('Should create an user', async () => {
    const user = {
      username: 'username_001',
      password: 'pass',
    };
    const createdUser = await createUser(user);
    expect(createdUser.username).toEqual(user.username);
    expect(createdUser.password).toBeUndefined();
    expect(createdUser.token).toBeDefined();
  });

  it('Should find all users', async (done) => {
    const user = {
      username: 'username_002',
      password: 'pass',
    };
    const user2 = {
      username: 'username_003',
      password: 'pass',
    };
    const createdUser = await createUser(user);
    const createdUser2 = await createUser(user2);
    await request(app)
      .get('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${admin.token}`)
      .expect(200)
      .then((response) => {
        const users = response.body;
        expect(users).toBeDefined();
        expect(users.length).toBeGreaterThanOrEqual(2);
        expect(createdUser.username).toEqual(user.username);
        expect(createdUser2.username).toEqual(user2.username);
        done();
      });
  });

  it('Should find an user', async (done) => {
    const user = {
      username: 'username_004',
      password: 'pass',
    };
    const createdUser = await createUser(user);
    await request(app)
      .get(`/api/users/${createdUser._id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${createdUser.token}`)
      .expect(200)
      .then((response) => {
        const foundUser = response.body;
        expect(foundUser).toBeDefined();
        expect(foundUser._id).toEqual(createdUser._id);
        expect(foundUser.username).toEqual(createdUser.username);
        done();
      });
  });

  it('Should update an user', async (done) => {
    const user = {
      username: 'username_005',
      password: 'pass',
    };
    const createdUser = await createUser(user);
    const updatedUsername = 'testUsername005updated';
    await request(app)
      .put(`/api/users/${createdUser._id}`)
      .send({ username: updatedUsername })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${createdUser.token}`)
      .expect(200)
      .then((response) => {
        const foundUser = response.body;
        expect(foundUser).toBeDefined();
        expect(foundUser._id).toEqual(createdUser._id);
        expect(foundUser.username).toEqual(updatedUsername);
        done();
      });
  });

  it('Should find me', async (done) => {
    const user = {
      username: 'username_006',
      password: 'pass',
    };
    const createdUser = await createUser(user);
    await request(app)
      .get('/api/users/me')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${createdUser.token}`)
      .expect(200)
      .then((response) => {
        const me = response.body;
        expect(me).toBeDefined();
        expect(me._id).toEqual(createdUser._id);
        expect(me.username).toEqual(createdUser.username);
        done();
      });
  });

  it('Should get an error when try to create the same user more than once', async (done) => {
    const user = {
      username: 'username_007',
      password: 'pass',
    };
    await createUser(user);
    await request(app)
      .post('/api/users')
      .send(user)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${admin.token}`)
      .expect(403)
      .then((response) => {
        expect(response.error).toBeDefined();
        expect(response.text).toBeDefined();
        expect(response.text).toEqual('Username already exists.');
        done();
      });
  });

  it('Should throw Username is required error when try to create an user without username', async (done) => {
    const username = '';
    await request(app)
      .post('/api/users')
      .send({
        username,
        password: '12345',
      })
      .set('Authorization', `Bearer ${admin.token}`)
      .set('Accept', 'application/json')
      .expect(422)
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('username');
        expect(response.body.errors[0].value).toEqual('');
        expect(response.body.errors[0].msg).toEqual('Username is required');
        done();
      });
  });
});
