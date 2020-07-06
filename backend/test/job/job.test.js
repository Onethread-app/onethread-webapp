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

describe('Job Module', () => {
  let accessToken, token, jobexperienceid;
  let accountApi = '/api/v1/accounts';
  let jobApi = '/api/v1/jobs';
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
    done();
  });
  it('should not create job Experience', async (done) => {
    const response = await request
      .post(jobApi + `/create-job-experience`)
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send({
        companyName: '',
        positionName: 'CEO',
        startYear: '',
        endingYear: '',
        currentlyWork: true,
        jobDescription: 'okay',
      });
    expect(response.status).toBe(400);
    done();
  });
  it('should not create job Experience because invalid date format', async (done) => {
    const response = await request
      .post(jobApi + `/create-job-experience`)
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send({
        companyName: '',
        positionName: 'CEO',
        startYear: 'huuu',
        endingYear: '',
        currentlyWork: true,
        jobDescription: 'okay',
      });

    expect(response.status).toBe(400);
    done();
  });
  it('should not create job Experience because endYear less than startingYear', async (done) => {
    const response = await request
      .post(jobApi + `/create-job-experience`)
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send({
        companyName: 'Tigrow',
        positionName: 'CEO',
        startYear: '1/11/2019',
        endingYear: '2/11/2018',
        currentlyWork: false,
        jobDescription: 'work done',
      });
    expect(response.status).toBe(400);
    done();
  });
  it('should create job Experience', async (done) => {
    const response = await request
      .post(jobApi + `/create-job-experience`)
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send({
        companyName: 'Tigrow',
        positionName: 'CEO',
        startYear: '1/11/2019',
        endingYear: '2/12/2019',
        currentlyWork: false,
        jobDescription: 'work done',
      });
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('_id');
    jobexperienceid = response.body.data._id;
    done();
  });
  it('should update job Experience', async (done) => {
    const response = await request
      .put(
        jobApi +
          `/job-experience-update?jobexperienceid=${jobexperienceid}`,
      )
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send({
        companyName: 'Tigrow Merchant',
        positionName: 'CEO',
        startYear: '1/11/2019',
        endingYear: '2/12/2019',
        currentlyWork: false,
        jobDescription: 'work done',
      });
    expect(response.status).toBe(200);
    done();
  });
  it('should not update job Experience because AuthError', async (done) => {
    const response = await request
      .put(jobApi + `/job-experience-update`)
      .send({
        companyName: 'Tigrow Merchant',
        positionName: 'CEO',
        startYear: '1/11/2019',
        endingYear: '2/12/2019',
        currentlyWork: false,
        jobDescription: 'work done',
      });
    expect(response.status).toBe(401);
    done();
  });
  it('should get all job Experience', async (done) => {
    const response = await request
      .get(jobApi)
      .set(`Authorization`, `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    done();
  });
});
