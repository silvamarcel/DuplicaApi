/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const {
  setup,
  modelUtil,
  request,
  app,
  testUtil,
} = require('../integrationTestsSetup');
const appError = require('../../server/controllers/appError');

const { userSeed } = setup.seeds;
const { validateError, validateRequiredErrors } = testUtil;
const { get, put, remove, post } = setup.request;
const {
  OK,
  NO_CONTENT,
  FORBIDDEN,
  NOT_FOUND,
  UNPROCESSABLE_ENTITY,
} = appError.statusCodes;

let admin;

const createUser = user =>
  modelUtil.create(request(app), user, modelUtil.apiPaths.users);

const validateUser = (expectedUser, user) => {
  expect(expectedUser.password).toBeUndefined();
  expect(expectedUser.username).toEqual(user.username);
  expect(expectedUser.role).toEqual(user.role);
};

const validateUserWithIdIncluded = (expectedUser, user) => {
  expect(expectedUser._id).toEqual(user._id);
  validateUser(expectedUser, user);
};

describe('User API', () => {
  beforeAll(async () => {
    await setup.init();
    admin = await modelUtil.getAdminUser(request(app));
  });

  afterAll(done => {
    setup.close(done);
  });

  it('Should list users', async done => {
    const user1 = userSeed.getNextUser();
    const user2 = userSeed.getNextUser();
    const createdUser1 = await createUser(user1);
    const createdUser2 = await createUser(user2);
    await get(app, '/api/users', admin.token)
      .expect(OK)
      .then(response => {
        const users = response.body;
        expect(users.length).toBeGreaterThanOrEqual(2);
        validateUser(createdUser1, user1);
        validateUser(createdUser2, user2);
        done();
      });
  });

  it('Should create an user', async () => {
    const user = userSeed.getNextUser();
    const createdUser = await createUser(user);
    validateUser(createdUser, user);
  });

  it('Should read an user', async done => {
    const user = userSeed.getNextUser();
    const createdUser = await createUser(user);
    await get(app, `/api/users/${createdUser._id}`, admin.token)
      .expect(OK)
      .then(response => {
        const foundUser = response.body;
        validateUserWithIdIncluded(foundUser, createdUser);
        done();
      });
  });

  it('Should update an user', async done => {
    const user = userSeed.getNextUser();
    const createdUser = await createUser(user);
    user.username = `${createdUser.username}_Updated`;
    delete user.password;
    await put(app, `/api/users/${createdUser._id}`, user, admin.token)
      .expect(OK)
      .then(response => {
        const updatedUser = response.body;
        validateUserWithIdIncluded(updatedUser, {
          ...createdUser,
          username: user.username,
        });
        done();
      });
  });

  it('Should delete a user', async done => {
    const user = userSeed.getNextUser();
    const createdUser = await createUser(user);
    await remove(app, `/api/users/${createdUser._id}`, admin.token).expect(
      NO_CONTENT,
    );
    await get(app, `/api/users/${createdUser._id}`, admin.token)
      .expect(NOT_FOUND)
      .then(response => {
        validateError(response, 'User not found');
        done();
      });
  });

  it('Should find me', async done => {
    const user = userSeed.getNextUser();
    const createdUser = await createUser(user);
    await get(app, '/api/users/me', createdUser.token)
      .expect(OK)
      .then(response => {
        const me = response.body;
        validateUserWithIdIncluded(me, createdUser);
        done();
      });
  });

  it('Should throw Username already exists error when try to create the same username more than once', async done => {
    const user = userSeed.getNextUser();
    await createUser(user);
    await post(app, '/api/users', user, admin.token)
      .send(user)
      .expect(FORBIDDEN)
      .then(response => {
        validateError(response, 'Username already exists.');
        done();
      });
  });

  it('Should throw Username already exists error when try to update for a username that already exists', async done => {
    const user1 = userSeed.getNextUser();
    const user2 = userSeed.getNextUser();
    await createUser(user1);
    const createdUser = await createUser(user2);
    user2.username = user1.username;
    await put(app, `/api/users/${createdUser._id}`, user2, admin.token)
      .expect(FORBIDDEN)
      .then(response => {
        validateError(response, 'Username already exists.');
        done();
      });
  });

  it('Should throw Username is required error when try to create an user without username', async done => {
    const user = userSeed.getNextUser();
    user.username = '';
    await post(app, '/api/users', user, admin.token)
      .expect(UNPROCESSABLE_ENTITY)
      .then(response => {
        validateRequiredErrors(
          response,
          'body',
          'username',
          user.username,
          'Username is required',
        );
        done();
      });
  });

  it('Should throw Role is required error when try to create an user without role', async done => {
    const user = userSeed.getNextUser();
    user.role = '';
    await post(app, '/api/users', user, admin.token)
      .expect(UNPROCESSABLE_ENTITY)
      .then(response => {
        validateRequiredErrors(
          response,
          'body',
          'role',
          user.role,
          'Role is required',
        );
        done();
      });
  });

  it('Should throw APIError with status 403 and Invalid id when a CastError occurs', async done => {
    const invalidId = 'myId';
    await get(app, `/api/users/${invalidId}`, admin.token)
      .expect(FORBIDDEN)
      .then(response => {
        validateError(response, 'Invalid id');
        done();
      });
  });
});
