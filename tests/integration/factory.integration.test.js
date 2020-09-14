/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const {
  setup,
  modelUtil,
  request,
  app,
  testUtil,
} = require('../integrationTestsSetup');
const appError = require('../../server/controllers/appError');

const { factorySeed, userSeed } = setup.seeds;
const { validateError, validateRequiredErrors } = testUtil;
const { get, put, remove, post } = setup.request;
const {
  OK,
  NO_CONTENT,
  FORBIDDEN,
  NOT_FOUND,
  UNPROCESSABLE_ENTITY,
} = appError.statusCodes;

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

const validateFactoryMissingField = (field, done) => response => {
  validateRequiredErrors(
    response,
    'body',
    field,
    '',
    `Factory ${field} is required`,
  );
  done();
};

const validateFactoryInvalidZipCode = done => response => {
  validateRequiredErrors(
    response,
    'body',
    'address.zipCode',
    'invalidZipCode',
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
      .expect(OK)
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
      .expect(OK)
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
      .expect(OK)
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
    ).expect(NO_CONTENT);
    await get(app, `/api/factories/${createdFactory._id}`, loggedUser.token)
      .expect(NOT_FOUND)
      .then(response => {
        validateError(response, 'Factory not found');
        done();
      });
  });

  it('Should throw A factory with this name already exists when try to create a factory with an existing name', async done => {
    const factory = factorySeed.getNextFactory();
    const newFactory = factorySeed.getNextFactory();
    await createFactory(factory);
    newFactory.name = factory.name;
    await post(app, '/api/factories', newFactory, loggedUser.token)
      .expect(FORBIDDEN)
      .then(response => {
        validateError(response, 'A factory with this name already exists.');
        done();
      });
  });

  it('Should throw A factory with this businessId already exists when try to create a factory with an existing businessId', async done => {
    const factory = factorySeed.getNextFactory();
    const newFactory = factorySeed.getNextFactory();
    await createFactory(factory);
    newFactory.businessId = factory.businessId;
    await post(app, '/api/factories', newFactory, loggedUser.token)
      .expect(FORBIDDEN)
      .then(response => {
        validateError(
          response,
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
      .expect(FORBIDDEN)
      .then(response => {
        validateError(response, 'A factory with this contract already exists.');
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
      .expect(UNPROCESSABLE_ENTITY)
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
      .expect(UNPROCESSABLE_ENTITY)
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
      .expect(UNPROCESSABLE_ENTITY)
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
      .expect(UNPROCESSABLE_ENTITY)
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
      .expect(UNPROCESSABLE_ENTITY)
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
      .expect(UNPROCESSABLE_ENTITY)
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
      .expect(UNPROCESSABLE_ENTITY)
      .then(validateFactoryInvalidZipCode(done));
  });

  it('Should throw APIError with status 403 and Invalid id when a CastError occurs', async done => {
    const invalidId = 'myId';
    await get(app, `/api/factories/${invalidId}`, loggedUser.token)
      .expect(FORBIDDEN)
      .then(response => {
        validateError(response, 'Invalid id');
        done();
      });
  });
});
