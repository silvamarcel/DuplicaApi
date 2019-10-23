/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const request = require('supertest');
const setup = require('../../../tests/setup');

const config = setup.initConfig();
const logger = require('../../logger/logger')({ config });
const middleware = require('../../middleware')({ config, logger });
const app = require('../../server')({ config, logger, middleware });
const modelUtil = require('../../../tests/utils/util.model.integration');

let loggedUser = null;

const createFactory = name => modelUtil.create(
  request(app),
  { name },
  modelUtil.apiPaths.factories,
);

const user = {
  username: 'userForFactoryIntegrationTest',
  password: 'pass',
};

describe('Factory API', () => {
  beforeAll(async () => {
    await setup.init();
    loggedUser = await modelUtil.create(
      request(app),
      user,
      modelUtil.apiPaths.users,
    );
  });

  afterAll((done) => {
    setup.close(done);
  });

  it('Should list factories', async (done) => {
    const factoryName = 'factory_002';
    const factoryName2 = 'factory_003';
    const createdFactory = await createFactory(factoryName);
    const createdFactory2 = await createFactory(factoryName2);
    await request(app)
      .get('/api/factories')
      .set('Authorization', `Bearer ${loggedUser.token}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        const factories = response.body;
        expect(factories).toBeDefined();
        expect(factories.length).toBeGreaterThanOrEqual(2);
        expect(createdFactory.name).toEqual(factoryName);
        expect(createdFactory2.name).toEqual(factoryName2);
        done();
      });
  });

  it('Should create a factory', async () => {
    const factoryName = 'factory_001';
    const createdFactory = await createFactory(factoryName);
    expect(createdFactory.name).toEqual(factoryName);
  });

  it('Should read a factory', async (done) => {
    const factoryName = 'factory_004';
    const createdFactory = await createFactory(factoryName);
    await request(app)
      .get(`/api/factories/${createdFactory._id}`)
      .set('Authorization', `Bearer ${loggedUser.token}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        const foundFactory = response.body;
        expect(foundFactory).toBeDefined();
        expect(foundFactory._id).toEqual(createdFactory._id);
        expect(foundFactory.name).toEqual(createdFactory.name);
        done();
      });
  });

  it('Should update a factory', async (done) => {
    const factoryName = 'factory_005';
    const createdFactory = await createFactory(factoryName);
    const updatedFactoryName = 'factory_005Updated';
    await request(app)
      .put(`/api/factories/${createdFactory._id}`)
      .send({ name: updatedFactoryName })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${loggedUser.token}`)
      .expect(200)
      .then((response) => {
        const foundFactory = response.body;
        expect(foundFactory).toBeDefined();
        expect(foundFactory._id).toEqual(createdFactory._id);
        expect(foundFactory.name).toEqual(updatedFactoryName);
        done();
      });
  });

  it('Should delete a factory', async (done) => {
    const factoryName = 'factory_006';
    const createdFactory = await createFactory(factoryName);
    await request(app)
      .delete(`/api/factories/${createdFactory._id}`)
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${loggedUser.token}`)
      .expect(200);
    await request(app)
      .get(`/api/factories/${createdFactory._id}`)
      .set('Authorization', `Bearer ${loggedUser.token}`)
      .set('Accept', 'application/json')
      .expect(403)
      .then((response) => {
        const { error } = response;
        expect(error).toBeDefined();
        expect(error.text).toEqual('Invalid id');
        done();
      });
  });

  it('Should get an error when try to create the same factory more than once', async (done) => {
    const factoryName = 'factory_006';
    await createFactory(factoryName);
    await request(app)
      .post('/api/factories')
      .send({
        name: factoryName,
      })
      .set('Authorization', `Bearer ${loggedUser.token}`)
      .set('Accept', 'application/json')
      .expect(403)
      .then((response) => {
        expect(response.error).toBeDefined();
        expect(response.text).toBeDefined();
        expect(response.text).toEqual('A factory with this name already exists.');
        done();
      });
  });

  it('Should throw name is required error when try to create a factory without name', async (done) => {
    const factoryName = '';
    await request(app)
      .post('/api/factories')
      .send({
        name: factoryName,
      })
      .set('Authorization', `Bearer ${loggedUser.token}`)
      .set('Accept', 'application/json')
      .expect(422)
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('name');
        expect(response.body.errors[0].value).toEqual('');
        expect(response.body.errors[0].msg).toEqual('Factory name is required');
        done();
      });
  });

  it('Should throw name is required error when try to update a factory without name', async (done) => {
    const factoryName = 'factory_007';
    const createdFactory = await createFactory(factoryName);
    await request(app)
      .put(`/api/factories/${createdFactory._id}`)
      .send({ name: '' })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${loggedUser.token}`)
      .expect(422)
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].location).toEqual('body');
        expect(response.body.errors[0].param).toEqual('name');
        expect(response.body.errors[0].value).toEqual('');
        expect(response.body.errors[0].msg).toEqual('Factory name is required');
        done();
      });
  });
});
