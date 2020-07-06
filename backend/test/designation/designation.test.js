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
