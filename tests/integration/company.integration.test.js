/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const {
  setup,
  modelUtil,
  request,
  app,
  testUtil,
} = require('../integrationTestsSetup');
const appError = require('../../server/controllers/appError');

const { companySeed, userSeed } = setup.seeds;
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

const createCompany = company =>
  modelUtil.create(request(app), company, modelUtil.apiPaths.companies);

const user = userSeed.getNextUser();

const validateCompany = (expectedCompany, company) => {
  expect(expectedCompany.name).toEqual(company.name);
  expect(expectedCompany.businessId).toEqual(company.businessId);
  expect(expectedCompany.bankInformation).toEqual(company.bankInformation);
  expect(expectedCompany.taxInformation).toEqual(company.taxInformation);
};

const validateCompanyWithIdIncluded = (createdCompany, done) => response => {
  const foundCompany = response.body;
  expect(foundCompany._id).toEqual(createdCompany._id);
  validateCompany(foundCompany, createdCompany);
  done();
};

const validateCompanyMissingField = (field, done, param) => response => {
  const deepField = param || field;
  validateRequiredErrors(
    response,
    'body',
    deepField,
    '',
    `Company ${field} is required`,
  );
  done();
};

const validateCompanyInvalidZipCode = done => response => {
  validateRequiredErrors(
    response,
    'body',
    'address.zipCode',
    'invalidZipCode',
    'Company zipCode can only contains numbers',
  );
  done();
};

describe('Company API', () => {
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

  it('Should list companies', async done => {
    const company1 = companySeed.getNextCompany();
    const company2 = companySeed.getNextCompany();
    const createdCompany1 = await createCompany(company1);
    const createdCompany2 = await createCompany(company2);
    await get(app, '/api/companies', loggedUser.token)
      .expect(OK)
      .then(response => {
        const companies = response.body;
        expect(companies.length).toBeGreaterThanOrEqual(2);
        validateCompany(createdCompany1, company1);
        validateCompany(createdCompany2, company2);
        done();
      });
  });

  it('Should create a company', async () => {
    const company = companySeed.getNextCompany();
    const createdCompany = await createCompany(company);
    validateCompany(createdCompany, company);
  });

  it('Should read a company', async done => {
    const company = companySeed.getNextCompany();
    const createdCompany = await createCompany(company);
    await get(app, `/api/companies/${createdCompany._id}`, loggedUser.token)
      .expect(OK)
      .then(validateCompanyWithIdIncluded(createdCompany, done));
  });

  it('Should update a company', async done => {
    const company = companySeed.getNextCompany();
    const createdCompany = await createCompany(company);
    company.name = `${company.name}_Updated`;
    await put(
      app,
      `/api/companies/${createdCompany._id}`,
      company,
      loggedUser.token,
    )
      .expect(OK)
      .then(
        validateCompanyWithIdIncluded(
          { ...createdCompany, name: company.name },
          done,
        ),
      );
  });

  it('Should delete a company', async done => {
    const company = companySeed.getNextCompany();
    const createdCompany = await createCompany(company);
    await remove(
      app,
      `/api/companies/${createdCompany._id}`,
      loggedUser.token,
    ).expect(NO_CONTENT);
    await get(app, `/api/companies/${createdCompany._id}`, loggedUser.token)
      .expect(NOT_FOUND)
      .then(response => {
        validateError(response, 'Company not found');
        done();
      });
  });

  it('Should throw A company with this name already exists when try to create a company with an existing name', async done => {
    const company = companySeed.getNextCompany();
    const newCompany = companySeed.getNextCompany();
    await createCompany(company);
    newCompany.name = company.name;
    await post(app, '/api/companies', company, loggedUser.token)
      .expect(FORBIDDEN)
      .then(response => {
        validateError(response, 'A company with this name already exists.');
        done();
      });
  });

  it('Should throw A company with this businessId already exists when try to create a company with an existing businessId', async done => {
    const company = companySeed.getNextCompany();
    const newCompany = companySeed.getNextCompany();
    await createCompany(company);
    newCompany.businessId = company.businessId;
    await post(app, '/api/companies', newCompany, loggedUser.token)
      .expect(FORBIDDEN)
      .then(response => {
        validateError(
          response,
          'A company with this businessId already exists.',
        );
        done();
      });
  });

  it('Should throw businessId is required error when try to create a company without businessId', async done => {
    const company = companySeed.getNextCompany();
    await post(
      app,
      '/api/companies',
      { ...company, businessId: '' },
      loggedUser.token,
    )
      .expect(UNPROCESSABLE_ENTITY)
      .then(validateCompanyMissingField('businessId', done));
  });

  it('Should throw name is required error when try to create a company without name', async done => {
    const company = companySeed.getNextCompany();
    await post(
      app,
      '/api/companies',
      { ...company, name: '' },
      loggedUser.token,
    )
      .expect(UNPROCESSABLE_ENTITY)
      .then(validateCompanyMissingField('name', done));
  });

  it('Should throw branch is required error when try to create a company without bankInformation', async done => {
    const company = companySeed.getNextCompany();
    const { bankInformation } = company;
    bankInformation.branch = '';
    await post(
      app,
      '/api/companies',
      { ...company, bankInformation },
      loggedUser.token,
    )
      .expect(UNPROCESSABLE_ENTITY)
      .then(
        validateCompanyMissingField('branch', done, 'bankInformation.branch'),
      );
  });

  it('Should throw accumulated pis is required error when try to create a company without taxInformation', async done => {
    const company = companySeed.getNextCompany();
    const { taxInformation } = company;
    taxInformation.accumulated.pis = '';
    await post(
      app,
      '/api/companies',
      { ...company, taxInformation },
      loggedUser.token,
    )
      .expect(UNPROCESSABLE_ENTITY)
      .then(
        validateCompanyMissingField(
          'accumulated pis',
          done,
          'taxInformation.accumulated.pis',
        ),
      );
  });

  it('Should throw businessId is required error when try to update a company without businessId', async done => {
    const company = companySeed.getNextCompany();
    const createdCompany = await createCompany(company);
    await put(
      app,
      `/api/companies/${createdCompany._id}`,
      { ...company, businessId: '' },
      loggedUser.token,
    )
      .expect(UNPROCESSABLE_ENTITY)
      .then(validateCompanyMissingField('businessId', done));
  });

  it('Should throw name is required error when try to update a company without name', async done => {
    const company = companySeed.getNextCompany();
    const createdCompany = await createCompany(company);
    await put(
      app,
      `/api/companies/${createdCompany._id}`,
      { ...company, name: '' },
      loggedUser.token,
    )
      .expect(UNPROCESSABLE_ENTITY)
      .then(validateCompanyMissingField('name', done));
  });

  it('Should throw branch is required error when try to update a company without bankInformation', async done => {
    const company = companySeed.getNextCompany();
    const createdCompany = await createCompany(company);
    const { bankInformation } = company;
    bankInformation.branch = '';
    await put(
      app,
      `/api/companies/${createdCompany._id}`,
      { ...company, bankInformation },
      loggedUser.token,
    )
      .expect(UNPROCESSABLE_ENTITY)
      .then(
        validateCompanyMissingField('branch', done, 'bankInformation.branch'),
      );
  });

  it('Should throw accumulated pis is required error when try to update a company without taxInformation', async done => {
    const company = companySeed.getNextCompany();
    const createdCompany = await createCompany(company);
    const { taxInformation } = company;
    taxInformation.accumulated.pis = '';
    await put(
      app,
      `/api/companies/${createdCompany._id}`,
      { ...company, taxInformation },
      loggedUser.token,
    )
      .expect(UNPROCESSABLE_ENTITY)
      .then(
        validateCompanyMissingField(
          'accumulated pis',
          done,
          'taxInformation.accumulated.pis',
        ),
      );
  });

  it('Should throw zipCode can only contains numbers when try to update a company with an invalid zipCode', async done => {
    const company = companySeed.getNextCompany();
    const createdCompany = await createCompany(company);
    const address = {
      ...company.address,
      zipCode: 'invalidZipCode',
    };
    await put(
      app,
      `/api/companies/${createdCompany._id}`,
      { ...company, address },
      loggedUser.token,
    )
      .expect(UNPROCESSABLE_ENTITY)
      .then(validateCompanyInvalidZipCode(done));
  });

  it('Should throw APIError with status 403 and Invalid id when a CastError occurs', async done => {
    const invalidId = 'myId';
    await get(app, `/api/companies/${invalidId}`, loggedUser.token)
      .expect(FORBIDDEN)
      .then(response => {
        validateError(response, 'Invalid id');
        done();
      });
  });
});
