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

describe('Board Module', ()=>{
  let accessToken, token, memberId, accountId, cname1, companyId1, departmentId;
  let companyApi = `/api/v1/company`;
  let accountApi = '/api/v1/accounts';
  let projectApi = '/api/v1/projects';
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

 

//   it('should get the all notifications for company companyId', async (done) => {
//     const response = await request
//       .get(notificationApi + `/${companyId}`)
//       .set({'Authorization':`Bearer ${accessToken}`, companyid: `${companyId}`});
//     expect(response.status).toBe(200);
//     done();
//   });
  
  
  
});
