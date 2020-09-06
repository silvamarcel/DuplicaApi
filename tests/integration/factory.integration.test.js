/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const { setup, modelUtil, request, app } = require('../integrationTestsSetup');

const { factorySeed, userSeed } = setup.seeds;
const { get, put, remove, post } = setup.request;

let loggedUser = null;

const createFactory = factory =>
  modelUtil.create(request(app), factory, modelUtil.apiPaths.factories);

const user = userSeed.getNextUser();

const validateFactory = (expectedFactory, factory) => {
  expect(expectedFactory.businessId).toEqual(factory.businessId);
  expect(expectedFactory.name).toEqual(factory.name);
  expect(expectedFactory.contract).toEqual(factory.contract);
};

const validateFactoryWithIdIncluded = (createdFactory, done) => response => {
  const foundFactory = response.body;
  expect(foundFactory._id).toEqual(createdFactory._id);
  validateFactory(foundFactory, createdFactory);
  done();
};

const validateFactoryField = field => response => {
  expect(response.body).toBeDefined();
  expect(response.body.errors).toBeDefined();
  expect(response.body.errors).toHaveLength(1);
  expect(response.body.errors[0].location).toEqual('body');
  expect(response.body.errors[0].param).toEqual(field);
  expect(response.body.errors[0].value).toEqual('');
};

const validateFactoryMissingField = (field, done) => response => {
  validateFactoryField(field);
  expect(response.body.errors[0].msg).toEqual(`Factory ${field} is required`);
  done();
};

const validateFactoryInvalidZipCode = done => response => {
  validateFactoryField('address.zipCode');
  expect(response.body.errors[0].msg).toEqual(
    'Factory zipCode can only contains numbers',
  );
  done();
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

  afterAll(done => {
    setup.close(done);
  });

  it('Should list factories', async done => {
    const factory1 = factorySeed.getNextFactory();
    const factory2 = factorySeed.getNextFactory();
    const createdFactory1 = await createFactory(factory1);
    const createdFactory2 = await createFactory(factory2);
    await get(app, '/api/factories', loggedUser.token)
      .expect(200)
      .then(response => {
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

  it('Should read a factory', async done => {
    const factory = factorySeed.getNextFactory();
    const createdFactory = await createFactory(factory);
    await get(app, `/api/factories/${createdFactory._id}`, loggedUser.token)
      .expect(200)
      .then(validateFactoryWithIdIncluded(createdFactory, done));
  });

  it('Should update a factory', async done => {
    const factory = factorySeed.getNextFactory();
    const createdFactory = await createFactory(factory);
    factory.name = `${factory.name}_Updated`;
    await put(
      app,
      `/api/factories/${createdFactory._id}`,
      factory,
      loggedUser.token,
    )
      .expect(200)
      .then(
        validateFactoryWithIdIncluded(
          { ...createdFactory, name: factory.name },
          done,
        ),
      );
  });

  it('Should delete a factory', async done => {
    const factory = factorySeed.getNextFactory();
    const createdFactory = await createFactory(factory);
    await remove(
      app,
      `/api/factories/${createdFactory._id}`,
      loggedUser.token,
    ).expect(200);
    await get(app, `/api/factories/${createdFactory._id}`, loggedUser.token)
      .expect(403)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toEqual('Invalid id');
        done();
      });
  });

  it('Should throw A factory with this name already exists when try to create a factory with an existing name', async done => {
    const factory = factorySeed.getNextFactory();
    const newFactory = factorySeed.getNextFactory();
    await createFactory(factory);
    newFactory.name = factory.name;
    await post(app, '/api/factories', newFactory, loggedUser.token)
      .expect(403)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toEqual(
          'A factory with this name already exists.',
        );
        done();
      });
  });

  it('Should throw A factory with this businessId already exists when try to create a factory with an existing businessId', async done => {
    const factory = factorySeed.getNextFactory();
    const newFactory = factorySeed.getNextFactory();
    await createFactory(factory);
    newFactory.businessId = factory.businessId;
    await post(app, '/api/factories', newFactory, loggedUser.token)
      .expect(403)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toEqual(
          'A factory with this businessId already exists.',
        );
        done();
      });
  });

  it('Should throw A factory with this contract already exists when try to create a factory with an existing contract', async done => {
    const factory = factorySeed.getNextFactory();
    const newFactory = factorySeed.getNextFactory();
    await createFactory(factory);
    newFactory.contract = factory.contract;
    await post(app, '/api/factories', newFactory, loggedUser.token)
      .expect(403)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toEqual(
          'A factory with this contract already exists.',
        );
        done();
      });
  });

  it('Should throw businessId is required error when try to create a factory without businessId', async done => {
    const factory = factorySeed.getNextFactory();
    await post(
      app,
      '/api/factories',
      { ...factory, businessId: '' },
      loggedUser.token,
    )
      .expect(422)
      .then(validateFactoryMissingField('businessId', done));
  });

  it('Should throw name is required error when try to create a factory without name', async done => {
    const factory = factorySeed.getNextFactory();
    await post(
      app,
      '/api/factories',
      { ...factory, name: '' },
      loggedUser.token,
    )
      .expect(422)
      .then(validateFactoryMissingField('name', done));
  });

  it('Should throw contract is required error when try to create a factory without contract', async done => {
    const factory = factorySeed.getNextFactory();
    await post(
      app,
      '/api/factories',
      { ...factory, contract: '' },
      loggedUser.token,
    )
      .expect(422)
      .then(validateFactoryMissingField('contract', done));
  });

  it('Should throw businessId is required error when try to update a factory without businessId', async done => {
    const factory = factorySeed.getNextFactory();
    const createdFactory = await createFactory(factory);
    await put(
      app,
      `/api/factories/${createdFactory._id}`,
      { ...factory, businessId: '' },
      loggedUser.token,
    )
      .expect(422)
      .then(validateFactoryMissingField('businessId', done));
  });

  it('Should throw name is required error when try to update a factory without name', async done => {
    const factory = factorySeed.getNextFactory();
    const createdFactory = await createFactory(factory);
    await put(
      app,
      `/api/factories/${createdFactory._id}`,
      { ...factory, name: '' },
      loggedUser.token,
    )
      .expect(422)
      .then(validateFactoryMissingField('name', done));
  });

  it('Should throw contract is required error when try to update a factory without contract', async done => {
    const factory = factorySeed.getNextFactory();
    const createdFactory = await createFactory(factory);
    await put(
      app,
      `/api/factories/${createdFactory._id}`,
      { ...factory, contract: '' },
      loggedUser.token,
    )
      .expect(422)
      .then(validateFactoryMissingField('contract', done));
  });

  it('Should throw zipCode can only contains numbers when try to update a factory with an invalid zipCode', async done => {
    const factory = factorySeed.getNextFactory();
    const createdFactory = await createFactory(factory);
    const address = {
      ...factory.address,
      zipCode: 'invalidZipCode',
    };
    await put(
      app,
      `/api/factories/${createdFactory._id}`,
      { ...factory, address },
      loggedUser.token,
    )
      .expect(422)
      .then(validateFactoryInvalidZipCode(done));
  });

  it('Should throw APIError with status 403 and Invalid id when a CastError occurs', async done => {
    const invalidId = 'myId';
    await get(app, `/api/factories/${invalidId}`, loggedUser.token)
      .expect(403)
      .then(response => {
        const { error } = response.body;
        expect(error).toBeDefined();
        expect(error.status).toEqual(403);
        expect(error.message).toEqual('Invalid id');
        done();
      });
  });
});
