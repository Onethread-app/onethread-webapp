// const mongoose = require('mongoose');
// const request = require('supertest-as-promised');
// const httpStatus = require('http-status');
// const chai = require('chai'); // eslint-disable-line import/newline-after-import
// const expect = chai.expect;
// const app = require('../../../index');

// chai.config.includeStack = true;

// /**
//  * root level hooks
//  */
// // after((done) => {
// //   mongoose.models = {};
// //   mongoose.modelSchemas = {};
// //   mongoose.connection.close();
// //   done();
// // });

// // describe('## User APIs', () => {
// //   let user = {
// //     name: 'r',
// //     gender: 'male',
// //     skillArea: 'nodeJs',
// //     email: 'a@a.com',
// //     mobileNumber: '1234567890',
// //     password: '123456'
// //   };

// //   describe('# POST /api/v1/register/user', () => {
// //     it('should create a new user', (done) => {
// //       request(app)
// //         .post('/api/v1/register/user/')
// //         .send(user)
// //         .expect(httpStatus.OK)
// //         .then((res) => {
// //           expect(res.body.name).to.equal(user.name);
// //           expect(res.body.gender).to.equal(user.gender);
// //           expect(res.body.skillArea).to.equal(user.skillArea);
// //           expect(res.body.email).to.equal(user.email);
// //           expect(res.body.mobileNumber).to.equal(user.mobileNumber);
// //           expect(res.body.password).to.equal(user.password);
// //           user = res.body;
// //           done();
// //         })
// //         .catch(done);
// //     });
// //   });
// // });
