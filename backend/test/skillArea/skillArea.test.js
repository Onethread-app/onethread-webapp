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

describe('SkillArea Module', () => {
  let accessToken, token;
  let accountApi = '/api/v1/accounts';
  let skillApi = '/api/v1/skills';
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
  it('should create skill', async (done) => {
    const response = await request.post(skillApi)
    .set(`Authorization`, `Bearer ${accessToken}`)
    .send({
      name: 'java'
      });
      expect(response.status).toBe(201);
      done();
  });
  it('should not create skill because of AuthError', async (done) => {
    const response = await request.post(skillApi)
    .set(`Authorization`, accessToken)
    .send({
      name: 'java'
      });
      expect(response.status).toBe(401);
      done();
  });
});
