const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index.js');

chai.config.includeStack = true;
// TODO category test
/**
 * root level hooks
 */
after(done => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('### Category APIs', () => {
  let user = {
    email: 'jest@gmail.com',
    password: 'Jest@1234'
  };

  let c1 = {
    name: 'a',
    type: 'job-seeker'
  };
  let c2 = {
    name: 'b'
  };
  let c3 = {
    name: 'c'
  };

  // login
  describe('## POST /api/v1/account/login', () => {
    it('should return status and token', done => {
      request(app)
        .post('/api/v1/account/login')
        .send(user)
        .expect(httpStatus.OK)
        .then(res => {
          const body = res.body;
          expect(body).to.contain.property('success');
          expect(body).to.contain.property('token');
          expect(body.success).to.equal(true);
          user.token = body.token;
          done();
        })
        .catch(done);
    });
  });

  // adding categories
  // describe('## POST categories', () => {
  //   it('should return status 401 (without token)', done => {
  //     request(app)
  //       .post('/api/v1/category')
  //       .send(c1)
  //       .expect(httpStatus.UNAUTHORIZED)
  //       .then(res => {
  //         expect(res.text).to.equal('Unauthorized');
  //         done();
  //       })
  //       .catch(done);
  //   });

  //   describe('# POST /api/v1/category', () => {
  //     it('should return message and newCategory (With token[Admin])', done => {
  //       request(app)
  //         .post('/api/v1/category')
  //         .set('Authorization', user.token)
  //         .send(c1)
  //         .expect(httpStatus.CREATED)
  //         .then(res => {
  //           const body = res.body;
  //           expect(body).to.contain.property('message');
  //           expect(body).to.contain.property('newCategory');
  //           expect(body.message).to.equal('New category created');
  //           c1._id = body.newCategory._id;
  //           done();
  //         })
  //         .catch(done);
  //     });
  //   });

  //   describe('# POST /api/v1/category/:cid', () => {
  //     it('should return message and newSubCategory (With token[Admin])', done => {
  //       request(app)
  //         .post(`/api/v1/category/${c1._id}`)
  //         .set('Authorization', user.token)
  //         .send(c2)
  //         .expect(httpStatus.CREATED)
  //         .then(res => {
  //           const body = res.body;
  //           expect(body).to.contain.property('message');
  //           expect(body).to.contain.property('newSubCategory');
  //           expect(body.message).to.equal(
  //             `New sub-category created under Category: ${c1.name}`
  //           );
  //           c2._id = body.newSubCategory._id;
  //           done();
  //         })
  //         .catch(done);
  //     });
  //   });

  //   describe('# POST /api/v1/category/sub-category/:sid', () => {
  //     it('should return message and newSubSubCategory (With token[Admin])', done => {
  //       request(app)
  //         .post(`/api/v1/category/sub-category/${c2._id}`)
  //         .set('Authorization', user.token)
  //         .send(c3)
  //         .expect(httpStatus.CREATED)
  //         .then(res => {
  //           const body = res.body;
  //           expect(body).to.contain.property('message');
  //           expect(body).to.contain.property('newSubSubCategory');
  //           expect(body.message).to.equal(
  //             `New sub-sub-category created under Sub-Category: ${c2.name}`
  //           );
  //           c2._id = body.newSubSubCategory._id;
  //           done();
  //         })
  //         .catch(done);
  //     });
  //   });
  // });

  // get categories
  describe('## GET /api/v1/category?type=', () => {
    // it("should return status 401 (without token)", done => {
    //   request(app)
    //     .get("/api/v1/category?type=user")
    //     .expect(httpStatus.UNAUTHORIZED)
    //     .then(res => {
    //       expect(res.text).to.equal("Unauthorized");
    //       done();
    //     })
    //     .catch(done);
    // });

    it("should return status 400 [/category] (without any 'type' in query string)", done => {
      request(app)
        .get('/api/v1/category')
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          const body = res.body;
          expect(body).to.contain.property('message');
          expect(body.message).to.equal("Expects 'type' in query string");
          done();
        })
        .catch(done);
    });
    it('should return status 200 [/category?type=emp] (for emp)', done => {
      request(app)
        .get('/api/v1/category?type=emp')
        .expect(httpStatus.OK)
        .then(res => {
          const body = res.body;
          expect(body).to.contain.property('type');
          expect(body).to.contain.property('categories');
          expect(body.type).to.equal('emp');
          done();
        })
        .catch(done);
    });
    it('should return status 200 [/category?type=business] (for business)', done => {
      request(app)
        .get('/api/v1/category?type=business')
        .expect(httpStatus.OK)
        .then(res => {
          const body = res.body;
          expect(body).to.contain.property('type');
          expect(body).to.contain.property('categories');
          expect(body.type).to.equal('business');
          done();
        })
        .catch(done);
    });
    it('should return status 200 [/category?type=job-seeker] (for job-seeker)', done => {
      request(app)
        .get('/api/v1/category?type=job-seeker')
        .expect(httpStatus.OK)
        .then(res => {
          const body = res.body;
          expect(body).to.contain.property('type');
          expect(body).to.contain.property('categories');
          expect(body.type).to.equal('job-seeker');
          done();
        })
        .catch(done);
    });
    it('should return status 200 [/category?type=business-category] (for business-category)', done => {
      request(app)
        .get('/api/v1/category?type=business-category')
        .expect(httpStatus.OK)
        .then(res => {
          const body = res.body;
          expect(body).to.contain.property('type');
          expect(body).to.contain.property('categories');
          expect(body.type).to.equal('business-category');
          done();
        })
        .catch(done);
    });
  });

  // delete categories
  // describe('## DELETE /api/v1/category/:cid', () => {
  //   it('should return status 401 (without token)', done => {
  //     request(app)
  //       .delete(`/api/v1/category/${c1._id}`)
  //       .expect(httpStatus.UNAUTHORIZED)
  //       .then(res => {
  //         expect(res.text).to.equal('Unauthorized');
  //         done();
  //       })
  //       .catch(done);
  //   });

  //   it('should return status 400 (With valid token and invalid ID )', done => {
  //     request(app)
  //       .delete(`/api/v1/category/5d08b05a29efcd5340f3f081d`)
  //       .set('Authorization', user.token)
  //       .expect(httpStatus.BAD_REQUEST)
  //       .then(res => {
  //         const body = res.body;
  //         expect(body).to.contain.property('message');
  //         expect(body.message).to.equal('Invalid ID');
  //         done();
  //       })
  //       .catch(done);
  //   });

  //   it('should return status 500 (With valid token and Wrong ID )', done => {
  //     request(app)
  //       .delete(`/api/v1/category/5d08b05a29efcd5340f3f081`)
  //       .set('Authorization', user.token)
  //       .expect(httpStatus.INTERNAL_SERVER_ERROR)
  //       .then(res => {
  //         const body = res.body;
  //         expect(body).to.contain.property('message');
  //         expect(body.message).to.equal('No category found with this ID');
  //         done();
  //       })
  //       .catch(done);
  //   });

  //   it('should delete a user (With valid ID & token)', done => {
  //     request(app)
  //       .delete(`/api/v1/category/${c1._id}`)
  //       .set('Authorization', user.token)
  //       .expect(httpStatus.OK)
  //       .then(res => {
  //         const body = res.body;
  //         expect(body).to.contain.property('message');
  //         expect(body.message).to.equal(
  //           'Category deleted with all subcategories and subsubcategories.'
  //         );
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });
});
