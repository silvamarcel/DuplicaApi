/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const { setup, modelUtil, request, app } = require('../integrationTestsSetup');

const { companySeed, userSeed } = setup.seeds;
const { get, put, remove, post } = setup.request;

let loggedUser = null;

const createCompany = company =>
  modelUtil.create(request(app), company, modelUtil.apiPaths.companies);

const user = userSeed.getNextUser();

const validateCompany = (expectedCompany, company) => {
  expect(expectedCompany.businessId).toEqual(company.businessId);
  expect(expectedCompany.name).toEqual(company.name);
  expect(expectedCompany.bankInformation).toEqual(company.bankInformation);
  expect(expectedCompany.taxInformation).toEqual(company.taxInformation);
};

const validateCompanyWithIdIncluded = (createdCompany, done) => response => {
  const foundCompany = response.body;
  expect(foundCompany._id).toEqual(createdCompany._id);
  validateCompany(foundCompany, createdCompany);
  done();
};

const validateCompanyField = field => response => {
  expect(response.body).toBeDefined();
  expect(response.body.errors).toBeDefined();
  expect(response.body.errors).toHaveLength(1);
  expect(response.body.errors[0].location).toEqual('body');
  expect(response.body.errors[0].param).toEqual(field);
  expect(response.body.errors[0].value).toEqual('');
};

const validateCompanyMissingField = (field, done) => response => {
  validateCompanyField(field);
  expect(response.body.errors[0].msg).toEqual(`Company ${field} is required`);
  done();
};

const validateCompanyInvalidZipCode = done => response => {
  validateCompanyField('address.zipCode');
  expect(response.body.errors[0].msg).toEqual(
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
      .expect(200)
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
      .expect(200)
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
      .expect(200)
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
    ).expect(200);
    await get(app, `/api/companies/${createdCompany._id}`, loggedUser.token)
      .expect(403)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toEqual('Invalid id');
        done();
      });
  });

  it('Should throw an error when try to create the same company more than once', async done => {
    const company = companySeed.getNextCompany();
    await createCompany(company);
    await post(app, '/api/companies', company, loggedUser.token)
      .expect(403)
      .then(response => {
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.message).toEqual(
          'A company with this name already exists.',
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
      .expect(422)
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
      .expect(422)
      .then(validateCompanyMissingField('name', done));
  });

  it('Should throw branch is required error when try to create a company without bankInformation', async done => {
    const company = companySeed.getNextCompany();
    await post(
      app,
      '/api/companies',
      { ...company, bankInformation: null },
      loggedUser.token,
    )
      .expect(422)
      .then(validateCompanyMissingField('branch', done));
  });

  it('Should throw accumulated pis is required error when try to create a company without taxInformation', async done => {
    const company = companySeed.getNextCompany();
    await post(
      app,
      '/api/companies',
      { ...company, taxInformation: null },
      loggedUser.token,
    )
      .expect(422)
      .then(validateCompanyMissingField('accumulated pis', done));
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
      .expect(422)
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
      .expect(422)
      .then(validateCompanyMissingField('name', done));
  });

  it('Should throw branch is required error when try to update a company without bankInformation', async done => {
    const company = companySeed.getNextCompany();
    const createdCompany = await createCompany(company);
    await put(
      app,
      `/api/companies/${createdCompany._id}`,
      { ...company, bankInformation: null },
      loggedUser.token,
    )
      .expect(422)
      .then(validateCompanyMissingField('branch', done));
  });

  it('Should throw accumulated pis is required error when try to update a company without taxInformation', async done => {
    const company = companySeed.getNextCompany();
    const createdCompany = await createCompany(company);
    await put(
      app,
      `/api/companies/${createdCompany._id}`,
      { ...company, taxInformation: null },
      loggedUser.token,
    )
      .expect(422)
      .then(validateCompanyMissingField('accumulated pis', done));
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
      .expect(422)
      .then(validateCompanyInvalidZipCode(done));
  });

  it('Should throw APIError with status 403 and Invalid id when a CastError occurs', async done => {
    const invalidId = 'myId';
    await get(app, `/api/companies/${invalidId}`, loggedUser.token)
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
