const supertest = require('supertest');
const dbHandler = require('../db-handler')
const app = require('../../index');
const Account = require('../../server/account/account.model');
const { Company } = require('../../server/company/company.model');
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

describe('Contact-Us module', () => {
  let contactUsApi = '/api/v1/contact/contact-sale';
  it('should able to send the mail', async (done) => {
    const response = await request.post(contactUsApi).send({
      name: 'orvi',
      email: 'robatdas2018@gmail.com',
      subject: 'new sale mail',
      message: 'we did it',
    });
    expect(response.status).toBe(201);
    done();
  });
  it('should not able to send the mail', async (done) => {
    const response = await request.post(contactUsApi).send({
      name: 'orvi',
      email: 'robatdas2018@',
      subject: 'new sale mail',
      message: 'we did it',
    });
    expect(response.status).toBe(400);
    done();
  });
  it('should not able to send the mail', async (done) => {
    const response = await request.post(contactUsApi).send({
      name: '',
      email: 'robatdas2018@gmail.com',
      subject: 'new sale mail',
      message: 'we did it',
    });
    expect(response.status).toBe(400);
    done();
  });
  it('should be able to send the mail', async (done) => {
    const response = await request.post(contactUsApi).send({
      name: 'orvi',
      email: 'robatdas2018@gmail.com',
      subject: '',
      message: 'ami achi',
    });
    expect(response.status).toBe(201);
    done();
  });
  it('should not be able to send the mail', async (done) => {
    const response = await request.post(contactUsApi).send({
      name: 'orvi',
      email: 'robatdas2018@gmail.com',
      subject: '',
      message: '',
    });
    expect(response.status).toBe(400);
    done();
  });
});