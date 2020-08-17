
const supertest = require('supertest');
const dbHandler = require('../db-handler');
const app = require('../../index');
const Plan = require('../../server/plan/plan.model');
const Account = require('../../server/account/account.model');
const {Member} = require('../../server/company/member/member.model');
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

describe('Designation Module', ()=>{
  let accessToken, token, companyId, accountId, cname;
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
      it('should check trial plan exist or not', async (done)=>{
        const plan = await Plan.findOne({name: 'trial'});
        expect(plan.name).toBe('trial');
        expect(plan.maxTier).toBe(100);
        expect(plan.pricing).toBe(0);
        done();
      });
      it('should create a new company', async (done) => {
        cname;
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
        cname = response.body.company.uniqueName;
        companyId = response.body.company._id;
        done();
      });
      it (`should find the memberId of a company`, async(done)=>{
          accountId = await Account.findOne({email: 'orvidas12@gmail.com'}).select('_id');
          memberId = await Member.findOne({company: companyId, account: accountId._id}).select('_id');
          expect(memberId).toHaveProperty('_id');
          memberId = memberId._id;
          done();
<<<<<<< HEAD
      })
=======
      });
>>>>>>> 6626ce22b9deeb2a07417e701f78b92d27b1a155
      it('should create a designation for member', async( done)=>{
          let designationApi = `/api/v1/company/${companyId}/designations/${memberId}`;
          const response = await request.post(designationApi).set('Authorization', `Bearer ${accessToken}`).send({
            division: 'cxo',
            position: 'CEO'
          })
          expect(response.status).toBe(201);
          done();
      })
})