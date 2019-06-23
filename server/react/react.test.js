const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');

chai.config.includeStack = true;

/**
 * root level hooks
 */

let token = '';
before(done => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  const credentials = {
    email: 'jest@gmail.com',
    password: 'jest1234'
  };

  request(app)
    .post('/api/v1/account/login')
    .send(credentials)
    .expect(200)
    .then(res => {
      // expect(res.body.success).to.equal(true);
      token = res.body.token;
      done();
    })
    .catch(done);
});

after(done => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Save APIs', () => {
  let react = {
    postRef: '5cef91bcd9448f34ee094a79'
  };

  describe('# SAVE /api/saves', () => {
    it('should not create a new save of post without auth', done => {
      request(app)
        .post('/api/v1/reacts')
        .send(react)
        .expect(httpStatus.UNAUTHORIZED)
        .end((err) => {
          done(err);
        });
    });

    it('should create a new react of post', done => {
      request(app)
        .post('/api/v1/reacts')
        .set('Authorization', token)
        .send(react)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.postRef).to.equal(react.postRef);
          react = res.body;
          done();
        })
        .catch(done);
    });
  });

//   describe('# GET /api/saves/:saveId', () => {
//     it('should get save details', done => {
//       request(app)
//         .get(`/api/v1/saves/${save._id}`)
//         .set('Authorization', token)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.postRef).to.equal(save.postRef);
//           done();
//         })
//         .catch(done);
//     });

//     it('should not get save details without login', done => {
//       request(app)
//         .get(`/api/v1/saves/${save._id}`)
//         .expect(httpStatus.UNAUTHORIZED)
//         .end((err) => {
//           done(err);
//         });
//     });
//   });

//   describe('# GET /api/saves/', () => {
//     it('should get all saves post item', done => {
//       request(app)
//         .get('/api/v1/saves')
//         .set('Authorization', token)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body).to.be.an('array');
//           done();
//         })
//         .catch(done);
//     });

//     it('should get all saves (with limit and skip)', done => {
//       request(app)
//         .get('/api/v1/saves')
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

//   describe('# DELETE /api/saves/', () => {
//     it('should not delete save without login', done => {
//       request(app)
//         .delete(`/api/v1/saves/${save._id}`)
//         .expect(httpStatus.UNAUTHORIZED)
//         .end((err) => {
//           done(err);
//         });
//     });

//     it('should delete save', done => {
//       request(app)
//         .delete(`/api/v1/saves/${save._id}`)
//         .set('Authorization', token)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.removed).to.equal(true);
//           done();
//         })
//         .catch(done);
//     });
//   });
});
