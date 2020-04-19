// const mongoose = require('mongoose');
// const request = require('supertest-as-promised');
// const httpStatus = require('http-status');
// const chai = require('chai'); // eslint-disable-line import/newline-after-import
// const expect = chai.expect;
// const app = require('../../index');

// chai.config.includeStack = true;

// /**
//  * root level hooks
//  */

// let token = '';
// before(done => {
//   // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
//   const credentials = {
//     email: 'jest@gmail.com',
//     password: 'jest1234'
//   };

//   request(app)
//     .post('/api/v1/account/login')
//     .send(credentials)
//     .expect(200)
//     .then(res => {
//       // expect(res.body.success).to.equal(true);
//       token = res.body.token;
//       done();
//     })
//     .catch(done);
// });

// after(done => {
//   // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
//   mongoose.models = {};
//   mongoose.modelSchemas = {};
//   mongoose.connection.close();
//   done();
// });

// describe('## Save APIs', () => {
//   let review = {
//     accountRef: '5ce3ab0e88692c3101c19056',
//     text: 'post',
//     rating: 4,
//     account: '5cee5cd6b6a83c52f5e5496b'
//   };

//   describe('# review /api/reviews', () => {
//     it('should not create a new review of post without auth', done => {
//       request(app)
//         .post('/api/v1/reviews')
//         .send(review)
//         .expect(httpStatus.UNAUTHORIZED)
//         .end(err => {
//           done(err);
//         });
//     });

//     it('should create a new review of post', done => {
//       request(app)
//         .post('/api/v1/reviews')
//         .set('Authorization', token)
//         .send(review)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.postRef).to.equal(review.postRef);
//           review = res.body;
//           done();
//         })
//         .catch(done);
//     });
//   });
// });
