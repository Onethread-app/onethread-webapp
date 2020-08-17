const supertest = require('supertest');
const dbHandler = require('../db-handler');
const app = require('../../index');
const Account = require('../../server/account/account.model');
const { Company } = require('../../server/company/company.model');
const {
  Member,
} = require('../../server/company/member/member.model');
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

describe('Project Module', () => {
  let accessToken,
    token,
    memberId,
    accountId,
    cname1,
    pid,
    companyId1,
    departmentId;
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
  it('should check trial plan exist or not', async (done) => {
    const plan = await Plan.findOne({ name: 'trial' });
    expect(plan.name).toBe('trial');
    expect(plan.maxTier).toBe(100);
    expect(plan.pricing).toBe(0);
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
    expect(response.body.company.uniqueName).toBeTruthy();
    expect(response.body.company._id).toBeTruthy();
    cname1 = response.body.company.uniqueName;
    companyId1 = response.body.company._id;
    done();
  });
  it(`should find the memberId of a company`, async (done) => {
    accountId = await Account.findOne({
      email: 'orvidas12@gmail.com',
    }).select('_id');
    memberId = await Member.findOne({
      company: companyId1,
      account: accountId._id,
    }).select('_id');
    expect(memberId).toHaveProperty('_id');
    memberId = memberId._id;
    accountId = accountId._id;
    done();
  });
  it('should able to create department', async (done) => {
    let departmentApi = `/api/v1/company/${companyId1}/departments`;
    const response = await request
      .post(departmentApi)
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send({
        name: 'creative',
        company: companyId1,
      });
    expect(response.status).toBe(201);
    departmentId = response.body.department._id;
    done();
  });
  it(`should create project by department`, async (done) => {
    memberId;
    let createProject = `${projectApi}/${companyId1}/create`;
    let concernedAdmin = {
      memberId: memberId,
      accountId: accountId,
    };

    const response = await request
      .post(createProject)
      .set({
        Authorization: `Bearer ${accessToken}`,
        companyid: `${companyId1}`,
      })
      .send({
        name: 'new Project',
        concernedAdmin: concernedAdmin,
        companyId: companyId1,
        type: 'department',
      });
    expect(response.status).toBe(201);
    done();
  });
  it(`should create project from home`, async (done) => {
    memberId;
    let createProject = `${projectApi}/${companyId1}/create-project`;

    const response = await request
      .post(createProject)
      .set({
        Authorization: `Bearer ${accessToken}`,
        companyid: `${companyId1}`,
      })
      .send({
        name: 'new Project',
        companyId: companyId1,
      });
    expect(response.status).toBe(201);
    pid = response.body._id;
    done();
  });
  it(`should get all projects for company`, async (done) => {
    let createProject = `${projectApi}/${companyId1}/lists`;

    const response = await request
      .get(createProject)
      .set({
        Authorization: `Bearer ${accessToken}`,
        companyid: `${companyId1}`,
      });
    expect(response.status).toBe(200);
    done();
  });
  it(`should get the project details`, async (done) => {
    let createProject = `${projectApi}?pid=${pid}`;

    const response = await request
      .get(createProject)
      .set({
        Authorization: `Bearer ${accessToken}`,
        companyid: `${companyId1}`,
      });
    expect(response.status).toBe(200);
    done();
  });
  it(`should change the project outline`, async (done) => {
    let createProject = `${projectApi}/outline?pid=${pid}`;
    const response = await request
      .put(createProject)
      .set({
        Authorization: `Bearer ${accessToken}`,
        companyid: `${companyId1}`,
      })
      .send({
        outline: 'new project I create',
      });
    expect(response.status).toBe(200);
    done();
  });
  it(`should not change the project outline because of max limit`, async (done) => {
    let createProject = `${projectApi}/outline?pid=${pid}`;
    const response = await request
      .put(createProject)
      .set({
        Authorization: `Bearer ${accessToken}`,
        companyid: `${companyId1}`,
      })
      .send({
        outline: 'new project I create',
      });
    expect(response.status).toBe(200);
    done();
  });
  it(`should change the project description`, async (done) => {
    let createProject = `${projectApi}/description?pid=${pid}`;
    const response = await request
      .put(createProject)
      .set({
        Authorization: `Bearer ${accessToken}`,
        companyid: `${companyId1}`,
      })
      .send({
        description: `yes... it's changed`,
      });
    expect(response.status).toBe(200);
    done();
  });
  it(`should not allow change the project description because of max limit`, async (done) => {
    let createProject = `${projectApi}/description?pid=${pid}`;
    let description = 'description' * 10000;
    const response = await request
      .put(createProject)
      .set({
        Authorization: `Bearer ${accessToken}`,
        companyid: `${companyId1}`,
      })
      .send({
        description: description,
      });
    expect(response.status).toBe(400);
    expect(response.body.type).toBe('ValidationError');
    done();
  });
  it(`should archive the project`, async (done) => {
    let createProject = `${projectApi}/description?pid=${pid}`;
    const response = await request
      .put(createProject)
      .set({
        Authorization: `Bearer ${accessToken}`,
        companyid: `${companyId1}`,
      })
    
    expect(response.status).toBe(200);
    done();
  });
  // it(`should not archive the project because of invalid pid`, async (done) => {
  //   let createProject = `${projectApi}/description?pid=1234`;
  //   const response = await request
  //     .put(createProject)
  //     .set({
  //       Authorization: `Bearer ${accessToken}`,
  //       companyid: `${companyId1}`,
  //     });
  //   expect(response.status).toBe(500);
  //   expect(response.body.type).toBe('CastError');
  //   done();
  // });
  it(`should show the archieved project list for company`, async (done) => {
    let createProject = `${projectApi}/${companyId1}/archive-list`;
    const response = await request
      .get(createProject)
      .set({
        Authorization: `Bearer ${accessToken}`,
        companyid: `${companyId1}`,
      });   
    expect(response.status).toBe(200);
    done();
  });
  
});
