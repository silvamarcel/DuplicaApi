/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const request = require('supertest');
const setup = require('../../../tests/setup');

const config = setup.initConfig();
const appError = require('../../error');
const logger = require('../../log/logger')({ config });
const middleware = require('../../middleware')({ config, logger });
const app = require('../../server')({ middleware, appError });
const modelUtil = require('../../../tests/utils/util.model.integration');

const { factorySeed } = setup.seeds;
const {
  get,
  put,
  remove,
  post,
} = setup.request;

let loggedUser = null;

const createFactory = factory => modelUtil.create(
  request(app),
  factory,
  modelUtil.apiPaths.factories,
);

const user = {
  username: 'userForFactoryIntegrationTest',
  password: 'pass',
  role: 'user',
};

const validateFactory = (expectedFactory, factory) => {
  expect(expectedFactory.businessId).toEqual(factory.businessId);
  expect(expectedFactory.name).toEqual(factory.name);
  expect(expectedFactory.contract).toEqual(factory.contract);
};

const validateFactoryWithoutName = done => (response) => {
  expect(response.body).toBeDefined();
  expect(response.body.errors).toBeDefined();
  expect(response.body.errors).toHaveLength(1);
  expect(response.body.errors[0].location).toEqual('body');
  expect(response.body.errors[0].param).toEqual('name');
  expect(response.body.errors[0].value).toEqual('');
  expect(response.body.errors[0].msg).toEqual('Factory name is required');
  done();
};

const getResolve = (createdFactory, done) => (response) => {
  const foundFactory = response.body;
  expect(foundFactory._id).toEqual(createdFactory._id);
  validateFactory(foundFactory, createdFactory);
  done();
};

describe('Factory API', () => {
  beforeAll(async () => {
    await setup.init();
    loggedUser = await modelUtil.create(request(app), user, modelUtil.apiPaths.users);
  });

  afterAll((done) => {
    setup.close(done);
  });

  it('Should list factories', async (done) => {
    const factory1 = factorySeed.getNextFactory();
    const factory2 = factorySeed.getNextFactory();
    const createdFactory1 = await createFactory(factory1);
    const createdFactory2 = await createFactory(factory2);
    await get(app, '/api/factories', loggedUser.token)
      .expect(200)
      .then((response) => {
        const factories = response.body;
        expect(factories.length).toBeGreaterThanOrEqual(2);
        validateFactory(createdFactory1, factory1);
        validateFactory(createdFactory2, factory2);
        done();
      });
  });

  it('Should create a factory', async () => {
    const factory = factorySeed.getNextFactory();
    const createdFactory = await createFactory(factory);
    validateFactory(createdFactory, factory);
  });

  it('Should read a factory', async (done) => {
    const factory = factorySeed.getNextFactory();
    const createdFactory = await createFactory(factory);
    await get(app, `/api/factories/${createdFactory._id}`, loggedUser.token)
      .expect(200)
      .then(getResolve(createdFactory, done));
  });

  it('Should update a factory', async (done) => {
    const factory = factorySeed.getNextFactory();
    const createdFactory = await createFactory(factory);
    const updatedFactoryName = `${factory.name}_Updated`;
    await put(app, `/api/factories/${createdFactory._id}`, { name: updatedFactoryName }, loggedUser.token)
      .expect(200)
      .then(getResolve({ ...createdFactory, name: updatedFactoryName }, done));
  });

  it('Should delete a factory', async (done) => {
    const factory = factorySeed.getNextFactory();
    const createdFactory = await createFactory(factory);
    await remove(app, `/api/factories/${createdFactory._id}`, loggedUser.token)
      .expect(200);
    await get(app, `/api/factories/${createdFactory._id}`, loggedUser.token)
      .expect(403)
      .then((response) => {
        const { error } = response;
        expect(error.text).toEqual('Invalid id');
        done();
      });
  });

  it('Should get an error when try to create the same factory more than once', async (done) => {
    const factory = factorySeed.getNextFactory();
    await createFactory(factory);
    await post(app, '/api/factories', factory, loggedUser.token)
      .expect(403)
      .then((response) => {
        expect(response.error).toBeDefined();
        expect(response.text).toBeDefined();
        expect(response.text).toEqual('A factory with this name already exists.');
        done();
      });
  });

  it('Should throw name is required error when try to create a factory without name', async (done) => {
    const factory = factorySeed.getNextFactory();
    await post(app, '/api/factories', { ...factory, name: '' }, loggedUser.token)
      .expect(422)
      .then(validateFactoryWithoutName(done));
  });

  it('Should throw name is required error when try to update a factory without name', async (done) => {
    const factory = factorySeed.getNextFactory();
    const createdFactory = await createFactory(factory);
    await put(app, `/api/factories/${createdFactory._id}`, { name: '' }, loggedUser.token)
      .expect(422)
      .then(validateFactoryWithoutName(done));
  });
});
