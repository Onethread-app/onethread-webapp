const supertest = require('supertest');
const dbHandler = require('../db-handler');
const app = require('../../index');
const Account = require('../../server/account/account.model');
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
describe('Account Module', () => {
  let token, accessToken, refreshToken;
  let accountApi = '/api/v1/accounts';
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
  it('should not be able to create an account because of validation', async (done) => {
    const response = await request.post(accountApi + `/signup`).send({
      firstName: '',
      lastName: '',
      email: 'orvidas12@gmail.com',
      password: 'Admin@12',
      confirmPassword: 'Admin@1234',
      birthDate: '1/11/1994',
    });
    expect(response.status).toBe(400);
    done();
  });
  it('should not be able to login because account is not verify yet', async (done) => {
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
  it('should be able to login an account', async (done) => {
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
  it('should update the account information', async (done) => {
    const response = await request
      .put(accountApi + '/update')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        location: '',
        bloodGroup: 'AB+',
      });
    expect(response.status).toBe(200);
    done();
  });
  it('should not update the account information', async (done) => {
    const response = await request
      .put(accountApi + '/update')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        location: '',
        bloodGroup: 'C+',
      });
    expect(response.status).toBe(400);
    done();
  });
  it('should not update the account information', async (done) => {
    const response = await request
      .put(accountApi + '/update')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        location: '',
        bloodGroup: 'C+',
      });
    expect(response.status).toBe(400);
    done();
  });
  it('should get the account information', async (done) => {
    const response = await request
      .get(accountApi)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    done();
  });
  it('should not get the account information', async (done) => {
    const response = await request
      .get(accountApi)
      .set('Authorization', `Bearer 1111`);
    expect(response.status).toBe(401);
    done();
  });
  it('should not be able to update account password', async (done) => {
    const response = await request
      .put(accountApi + '/change-password')
      .send({
        oldPassword: 'Admin@1234',
        newPassword: 'Admin@12345',
      });
    expect(response.status).toBe(401);
    expect(response.body.type).toBe('AuthError');
    done();
  });
  it('should not be able to update account password', async (done) => {
    const response = await request
      .put(accountApi + '/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        oldPassword: 'Admin@1234',
        newPassword: 'Admin@1234',
      });
    expect(response.status).toBe(400);
    expect(response.body.type).toBe('ValidationError');
    done();
  });
  it('should be able to update account password', async (done) => {
    const response = await request
      .put(accountApi + '/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        oldPassword: 'Admin@1234',
        newPassword: 'Admin@12345',
      });
    expect(response.status).toBe(200);
    done();
  });
  it('should not login account because of mismatch credentials ', async (done) => {
    const response = await request.post(accountApi + `/login`).send({
      email: 'orvidas12@gmail.com',
      password: 'Admin@1234',
    });
    expect(response.status).toBe(401);
    expect(response.body.type).toBe('AuthError');
    done();
  });
  it('should able to login ', async (done) => {
    const account = await Account.findOne({
      email: 'orvidas12@gmail.com',
    });
    const response = await request.post(accountApi + `/login`).send({
      email: 'orvidas12@gmail.com',
      password: 'Admin@12345',
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    done();
  });
  it('should be able to resend mail for account holders', async (done) => {
    const response = await request
      .post(accountApi + '/resend-email')
      .send({
        email: 'orvidas12@gmail.com',
        resentType: 'verify-account',
      });
    expect(response.status).toBe(200);
    done();
  });
  it('should not be able to resend mail for account holders', async (done) => {
    const response = await request
      .post(accountApi + '/resend-email')
      .send({
        email: 'orvidas12@gmail.com',
        resentType: '',
      });
    expect(response.status).toBe(400);
    done();
  });
  it('should get the account timeline', async (done) => {
    const response = await request
      .get(accountApi + '/timeline')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    done();
  });
  it('should get the account skill', async (done) => {
    const response = await request
      .get(accountApi + '/skill-area')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    done();
  });
  it('should refresh accessToken', async (done) => {
    const response = await request
      .post(accountApi + '/refresh')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        refreshToken: refreshToken,
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    done();
  });
});