const supertest = require('supertest');
const dbHandler = require('../db-handler');
const app = require('../../index');
const Account = require('../../server/account/account.model');
const { Company } = require('../../server/company/company.model');
const Plan = require('../../server/plan/plan.model');
const request = supertest(app);

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
    await dbHandler.connect();    
});

beforeEach(async () => {
    await dbHandler.seedDatabase();
});
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

describe('Company Module', () => {
  let accessToken, cname1, cname2, companyId1, companyId2;
  let companyApi = `/api/v1/company`;
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
  it('should check trial plan exist or not', async (done)=>{
    const plan = await Plan.findOne({name: 'trial'});
    expect(plan.name).toBe('trial');
    expect(plan.maxTier).toBe(100);
    expect(plan.pricing).toBe(0);
    done();
  })
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
    expect(response.body.company.uniqueName).toBeTruthy();
    expect(response.body.company._id).toBeTruthy();
    cname1 = response.body.company.uniqueName;
    companyId1 = response.body.company._id;
    done();
  });
  it('should not create a new company because of duplicate name', async (done) => {
    const response = await request
      .post(companyApi)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'tigrow',
        type: 'Agent',
        address: 'Mohakhali',
      });
    expect(response.status).toBe(409);
    expect(response.body.type).toBe('DuplicateCompanyNameError');
    done();
  });
  it('should not create a new company because of type validation', async (done) => {
    const response = await request
      .post(companyApi)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'tigrow12',
        type: 'A',
        address: 'Mohakhali',
      });
    expect(response.status).toBe(400);
    done();
  });
  it('should not create a new company because address missing', async (done) => {
    const response = await request
      .post(companyApi)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'tigrow12',
        type: 'Agent',
        address: '',
      });
    expect(response.status).toBe(400);
    expect(response.body.type).toBe('ValidationError');
    done();
  });
  it('should get the company cname1 information', async (done) => {
    const response = await request
      .get(companyApi + `/${cname1}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    done();
  });
  it('should not get the company information because of authError', async (done) => {
    const response = await request.get(companyApi + `/${cname1}`);
    expect(response.status).toBe(401);
    done();
  });
  it('should create a new company name cname2', async (done) => {
    const response = await request
      .post(companyApi)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'tigrow12',
        type: 'Agent',
        address: 'Mohakhali',
      });
    expect(response.status).toBe(201);
    expect(response.body.company.uniqueName).toBeTruthy();
    expect(response.body.company._id).toBeTruthy();
    cname2 = response.body.company.uniqueName;
    companyId2 = response.body.company._id;
    done();
  });
  it('should get the company cname2 information', async (done) => {
    const response = await request
      .get(companyApi + `/${cname2}`)
      .set({'Authorization':`Bearer ${accessToken}`, companyid: `${companyId1}`});
    expect(response.status).toBe(200);
    done();
  });
  it('should update the cname1 basic info', async (done) => {
    const response = await request
      .put(companyApi + `/${companyId1}` + '/basic')
      .set({'Authorization':`Bearer ${accessToken}`, companyid: `${companyId1}`})
      .send({
        legalOwnerName: 'Farhan',
      });
    expect(response.status).toBe(200);
    done();
  });
  it('should not update the cname1 basic info because of auth error', async (done) => {
    const response = await request
      .put(companyApi + `/${companyId1}` + '/basic')
      .send({
        legalOwnerName: 'Farhan',
      });
    expect(response.status).toBe(401);
    done();
  });
  it('should update the cname2 basic info', async (done) => {
    const response = await request
      .put(companyApi + `/${companyId2}` + '/basic')
      .set({'Authorization':`Bearer ${accessToken}`, companyid: `${companyId1}`})
      .send({
        legalOwnerMail: 'huuukka@gmail.com',
      });
    expect(response.status).toBe(200);
    done();
  });
  it('should update the cname2 basic info', async (done) => {
    const response = await request
      .put(companyApi + `/${companyId2}` + '/basic')
      .set({'Authorization':`Bearer ${accessToken}`, companyid: `${companyId1}`})
      .send({
        legalOwnerMail: '',
      });
    expect(response.status).toBe(200);
    done();
  });
  it('should update the cname2 basic info because of authError', async (done) => {
    const response = await request
      .put(companyApi + `/${companyId2}` + '/basic')
      .send({
        legalOwnerMail: '',
      });
    expect(response.status).toBe(401);
    done();
  });

  it('should update the cname2 basic info', async (done) => {
    const response = await request
      .put(companyApi + `/${companyId1}` + '/basic')
      .set({'Authorization':`Bearer ${accessToken}`, companyid: `${companyId1}`})
      .send({
        legalOwne: '',
      });
    expect(response.status).toBe(200);
    done();
  });
  it('should update the cname1 basic about info', async (done) => {
    const response = await request
      .put(companyApi + `/${companyId1}` + '/about')
      .set({'Authorization':`Bearer ${accessToken}`, companyid: `${companyId1}`})
      .send({
        about: 'Tigrow is a social enterprise',
      });
    expect(response.status).toBe(200);
    done();
  });
  it('should add the cname1 certificate', async (done) => {
    const response = await request
      .post(companyApi + `/${companyId1}` + '/certification')
      .set({'Authorization':`Bearer ${accessToken}`, companyid: `${companyId1}`})
      .send({
        name: 'MCC',
        description: 'Best startup',
      });
    expect(response.status).toBe(201);
    done();
  });
  it('should not add the cname1 certificate because of auth error', async (done) => {
    const response = await request
      .post(companyApi + `/${companyId1}` + '/certification')
      .send({
        name: 'MCC',
        description: 'Best startup',
      });
    expect(response.status).toBe(401);
    done();
  });
  it('should change the name of company cname1', async (done) => {
    const response = await request
      .put(companyApi + `/${companyId1}` + '/changeName')
      .set({'Authorization':`Bearer ${accessToken}`, companyid: `${companyId1}`})
      .send({
        name: 'Tigrow1234',
      });
    const company = await Company.findOne({ name: 'Tigrow1234' });
    expect(response.status).toBe(200);
    expect(company.name).toBe('Tigrow1234');
    done();
  });
  it('should not change the name of company cname1 because of auth Error', async (done) => {
    const response = await request
      .put(companyApi + `/${companyId1}` + '/changeName')
      .send({
        name: 'Tigrow1234',
      });
    expect(response.status).toBe(401);
    expect(response.body.type).toBe('AuthError');
    done();
  });
  it('should not change the name of company cname1 because of duplicate name', async (done) => {
    const response = await request
      .put(companyApi + `/${companyId1}` + '/changeName')
      .set({'Authorization':`Bearer ${accessToken}`, companyid: `${companyId1}`})
      .send({
        name: 'Tigrow1234',
      });
    expect(response.status).toBe(409);
    done();
  });
  it('should create announcement for company cname1', async (done) => {
    const response = await request
      .post(companyApi + `/${companyId1}` + '/announcements')
      .set({'Authorization':`Bearer ${accessToken}`, companyid: `${companyId1}`})
      .send({
        text: 'kalk office bondho',
      });
    expect(response.status).toBe(201);
    done();
  });
  it('should not create announcement for company cname1', async (done) => {
    const response = await request
      .post(companyApi + `/${companyId1}` + '/announcements')
      .set({'Authorization':`Bearer ${accessToken}`, companyid: `${companyId1}`})
      .send({
        text: '',
      });
    expect(response.status).toBe(400);
    done();
  });
  it('should get the all announcements for company cname1', async (done) => {
    const response = await request
      .get(companyApi + `/${companyId1}` + '/announcements')
      .set({'Authorization':`Bearer ${accessToken}`, companyid: `${companyId1}`});
    expect(response.status).toBe(200);
    done();
  });
  it('should get the dashboard for company cname1', async (done) => {
    const response = await request
      .get(companyApi + `/${companyId1}` + '/dashboard')
      .set({'Authorization':`Bearer ${accessToken}`, companyid: `${companyId1}`});
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('totalProject');
    expect(response.body.data).toHaveProperty('totalEmployee');
    expect(response.body.data).toHaveProperty('totalAssociates');
    done();
  });
  it('should not get the dashboard for company cname1 because of AuthError', async (done) => {
    const response = await request.get(
      companyApi + `/${companyId1}` + '/dashboard',
    );
    expect(response.status).toBe(401);
    expect(response.body.type).toBe('AuthError');
    done();
  });
  it('should get the individual company list', async (done) => {
    const account = await Account.findOne({
      email: 'orvidas12@gmail.com',
    });
    const response = await request
      .get(companyApi + `/individual/${account._id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    done();
  });
  it('should not get the individual company list because of Auth Error', async (done) => {
    const account = await Account.findOne({
      email: 'orvidas12@gmail.com',
    });
    const response = await request.get(
      companyApi + `/individual/${account._id}`,
    );
    expect(response.status).toBe(401);
    expect(response.body.type).toBe('AuthError');
    done();
  });
//   it('should search company', async (done) => {
//     const response = await request
//       .get(companyApi + `/search?name=T&companyId=${companyId1}`)
//       .set('Authorization', `Bearer ${accessToken}`);
//     expect(response.status).toBe(200);
//     done();
//   });
//   it('should search company', async (done) => {
//     const response = await request
//       .get(companyApi + `/search?name=t&companyId=${companyId1}`)
//       .set('Authorization', `Bearer ${accessToken}`);
//     expect(response.status).toBe(200);
//     expect(response.body.data).not.toBe([]);
//     done();
//   });
});