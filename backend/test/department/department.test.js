const supertest = require('supertest');
const dbHandler = require('../db-handler');
const app = require('../../index');
const request = supertest(app);

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

// beforeEach(() => {
//   jest.setTimeout(100000);
// });
/**
 * Clear all test data after every test.
 */
// afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
  await dbHandler.closeDatabase();
  // app.close(done);
});

describe('Department Module', () => {
  let accessToken, token, companyId, cname;
  let accountApi = '/api/v1/accounts';
  let companyApi = `/api/v1/company`;
  it('should be able to create a new account', async (done) => {
    const response = await request.post(accountApi + `/signup`).send({
      firstName: 'Orvi',
      lastName: 'Das',
      email: 'orvidas12@gmail.com',
      password: 'Admin@1234',
      confirmPassword: 'Admin@1234',
      birthDate: '1/11/1994',
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
    done();
  });
  it('should not be able to login', async (done) => {
    const response = await request.post(accountApi + `/login`).send({
      email: 'orvidas12@gmail.com',
      password: 'Admin@1234',
    });
    expect(response.status).toBe(401);
    expect(response.body.type).toBe('VerificationError');
    done();
  });
  it('should be able to verify account', async (done) => {
    const response = await request.get(
      accountApi + `/verify-account/` + token,
    );
    expect(response.status).toBe(200);
    done();
  });
  it('should be able to login', async (done) => {
    const response = await request.post(accountApi + `/login`).send({
      email: 'orvidas12@gmail.com',
      password: 'Admin@1234',
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    done();
  });
  it('should create a new company', async (done) => {
    const response = await request
      .post(companyApi)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'tigrow',
        type: 'Agent',
        address: 'Mohakhali',
      });
    expect(response.status).toBe(201);
    expect(response.body.company.name).toBeTruthy();
    expect(response.body.company._id).toBeTruthy();
    cname = response.body.company.name;
    companyId = response.body.company._id;
    done();
  });
  it('should check companyId works', async (done) => {
    const response = request.get(companyApi + `/${companyId}`);
    expect(response.status).toBeUndefined();
    done();
  });
  it('should able to create department', async (done) => {
    let departmentApi = `/api/v1/company/${companyId}/departments`;
    const response = await request
      .post(departmentApi)
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send({
        name: 'creative',
        company: companyId,
      });
    expect(response.status).toBe(201);
    done();
  });
  it('should not able to create same department', async (done) => {
    let departmentApi = `/api/v1/company/${companyId}/departments`;
    const response = await request
      .post(departmentApi)
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send({
        name: 'creative',
        company: companyId,
      });
    expect(response.status).toBe(409);
    expect(response.body.type).toBe('DuplicateKeyError');
    done();
  });
  it('should not able to create same department because of minimum character', async (done) => {
    let departmentApi = `/api/v1/company/${companyId}/departments`;
    const response = await request
      .post(departmentApi)
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send({
        name: '',
        company: companyId,
      });
    expect(response.status).toBe(400);
    expect(response.body.type).toBe('ValidationError');
    done();
  });
  it('should get all the company departments', async (done) => {
    let departmentApi = `/api/v1/company/${companyId}/departments`;
    const response = await request
      .get(departmentApi)
      .set(`Authorization`, `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    done();
  });
  it('should not get all the company departments because of AuthError', async (done) => {
    let departmentApi = `/api/v1/company/${companyId}/departments`;
    const response = await request.get(departmentApi);
    expect(response.status).toBe(401);
    done();
  });
});
