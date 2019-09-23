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
//   let credentials = {
//     email: 'jest@gmail.com',
//     password: 'Jest1234'
//   };

//   request(app)
//     .post('/api/v1/account/login')
//     .send(credentials)
//     .expect(200)
//     .then(res => {
//       //expect(res.body.success).to.equal(true);
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

// describe('## report APIs', () => {
//   let report = {
//     reportType: 'false',
//     user: '5cee5cd6b6a83c52f5e5496b',
//     post: '5ceb6a94b3b70224662e4779',
//     comment: '5ce0f1fee97dae22b9d82c86',
//     text: 'hola'
//   };

//   describe('# userSAVE /api/reports', () => {
//     let reportuser = Object.create({
//       refrence: report.user,
//       text: report.text,
//       reportContent: 'user',
//       reportType: 'false'
//     });

//     it('should not create a new report of post user refrence without login', done => {
//       request(app)
//         .post('/api/v1/reports')
//         .query({ refType: 'user' }) // need to change userRef id also
//         .send(reportuser)
//         .expect(httpStatus.UNAUTHORIZED)
//         .end(err => {
//           done(err);
//         });
//     });

//     it('should create a new report of post user refrence', done => {
//       request(app)
//         .post('/api/v1/reports')
//         .set('Authorization', token)
//         .query({ refType: 'user' }) // need to change userRef id also
//         .send(reportuser)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.user).to.equal(report.user);
//           expect(res.body.reportType[0]).to.equal(report.reportType);
//           //report = res.body;
//           done();
//         })
//         .catch(done);
//     });
//   });

//   describe('# commmentSAVE /api/reports', () => {
//     let reportuser = Object.create({
//       reportType: 'false',
//       refrence: report.comment,
//       reportContent: 'comment',
//       text: report.text
//     });

//     it('should not create a new report of post comment refrence withou login', done => {
//       request(app)
//         .post('/api/v1/reports')

//         .query({ refType: 'comment' }) // need to change userRef id also
//         .send(reportuser)
//         .expect(httpStatus.UNAUTHORIZED)
//         .end(err => {
//           done(err);
//         });
//     });

//     it('should create a new report of post comment refrence', done => {
//       request(app)
//         .post('/api/v1/reports')
//         .set('Authorization', token)
//         .query({ refType: 'comment' }) // need to change userRef id also
//         .send(reportuser)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.comment).to.equal(report.comment);
//           expect(res.body.reportType[0]).to.equal(report.reportType);
//           //report = res.body;
//           done();
//         })
//         .catch(done);
//     });
//   });

//   describe('# postSAVE /api/reports', () => {
//     //let reportuser = {refrence : postRef , text : text} = report;
//     //let { userRef,commentRef, ...reportuser } = report; //rest not working
//     let reportuser = Object.create({
//       reportType: 'false',
//       refrence: report.post,
//       reportContent: 'post',
//       text: report.text
//     });

//     it('should not create a new report of post with post reference without login', done => {
//       request(app)
//         .post('/api/v1/reports')

//         .query({ refType: 'post' }) // need to change userRef id also
//         .send(reportuser)
//         .expect(httpStatus.UNAUTHORIZED)
//         .end(err => {
//           done(err);
//         });
//     });

//     it('should create a new report of post with post reference', done => {
//       request(app)
//         .post('/api/v1/reports')
//         .set('Authorization', token)
//         .query({ refType: 'post' }) // need to change userRef id also
//         .send(reportuser)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.post).to.equal(report.post);
//           expect(res.body.reportType[0]).to.equal(report.reportType);
//           report = res.body;
//           done();
//         })
//         .catch(done);
//     });
//   });

//   describe('# GET /api/reports/:reportId', () => {
//     it('should not get report details without login or admin', done => {
//       request(app)
//         .get(`/api/v1/reports/${report._id}`)

//         .expect(httpStatus.UNAUTHORIZED)
//         .end(err => {
//           done(err);
//         });
//     });

//     it('should get report details', done => {
//       request(app)
//         .get(`/api/v1/reports/${report._id}`)
//         .set('Authorization', token)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.postRef).to.equal(report.postRef);
//           done();
//         })
//         .catch(done);
//     });
//   });

//   describe('# post /api/reports/block/:reportId', () => {
//     let reportuser = Object.create({
//       reportType: 'false',
//       refrence: report.post,
//       reviewStatus: 'block',
//       text: report.text
//     });
//     it('should not block reported content action without login', done => {
//       request(app)
//         .post(`/api/v1/reports/block/${report._id}`)

//         .send(reportuser)
//         .expect(httpStatus.UNAUTHORIZED)
//         .end(err => {
//           done(err);
//         });
//     });

//     it('should block reported content action', done => {
//       request(app)
//         .post(`/api/v1/reports/block/${report._id}`)
//         .set('Authorization', token)
//         .send(reportuser)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.postRef).to.equal(report.postRef);
//           done();
//         })
//         // .catch(err => {
//         //   console.log(err);
//         // })
//         .catch(done);
//     });
//   });

//   describe('# GET /api/report/', () => {
//     it('should get all report post item', done => {
//       request(app)
//         .get('/api/v1/reports')
//         .set('Authorization', token)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body).to.be.an('array');
//           done();
//         })
//         .catch(done);
//     });

//     it('should get all reports (with limit and skip)', done => {
//       request(app)
//         .get('/api/v1/reports')
//         .set('Authorization', token)
//         .query({ limit: 10, skip: 1 })
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body).to.be.an('array');
//           done();
//         })
//         .catch(done);
//     });
//   });

//   describe('# DELETE /api/reports/', () => {
//     it('should not delete save without login', done => {
//       request(app)
//         .delete(`/api/v1/reports/${report._id}`)

//         .expect(httpStatus.UNAUTHORIZED)
//         .end(err => {
//           done(err);
//         });
//     });
//     it('should delete report', done => {
//       request(app)
//         .delete(`/api/v1/reports/${report._id}`)
//         .set('Authorization', token)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.removed).to.equal(true);
//           done();
//         })
//         .catch(done);
//     });
//   });
// });
