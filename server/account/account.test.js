const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const app = require('../../index');

// // const request = require("supertest-as-promised");
// // const httpStatus = require("http-status");
// // const chai = require("chai"); // eslint-disable-line import/newline-after-import
// // const expect = chai.expect;
// // const app = require("../../index.js");

// // chai.config.includeStack = true;

// // /**
// //  * root level hooks
// //  */

after(done => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});
describe('## Registration APIs for User', () => {
  let userAccount = {
    firstName: 'orvi',
    lastName: 'das',
    email: 'robatda2018@gmail.com',
    password: 'Orvi@123456',
    confirmPassword: 'Orvi@123456',
    contactNo: '+8801683754716',
  };
  describe('# POST /api/v1/accounts/signup', () => {
    it('should create an account', done => {
      request(app)
        .post('/api/v1/account/signup')
        .send(userAccount)
        .end((err, res) => {
          userAccount = res.body.user;
          done();
        });
    });
  });

  let userAccount2 = {
    firstName: 'orvi',
    lastName: 'das',
    email: '',
    password: 'Orvi@123456',
    confirmPassword: 'Orvi@123456',
    contactNo: '+8801683754716',
  };
  describe('# POST /api/v1/accounts/signup', () => {
    it('should not create an account', done => {
      request(app)
        .post('/api/v1/accounts/signup')
        .send(userAccount2)
        .end((err, res) => {
          userAccount2 = res.body.user;
          done();
        });
    });
  });
});

describe('## Login APIs for Account Holders', () => {
  let userAccount3 = {
    email: 'robatdas2018@gmail.com',
    password: 'Orvi@123456',
  };
  describe('# POST /api/v1/accounts/login', () => {
    it('should login in their account', done => {
      request(app)
        .post('/api/v1/accounts/login')
        .send(userAccount3)
        .end((err, res) => {
          userAccount3.token = res.body.token;
          done();
        });
    });
  });
  // let Account = {
  //   email: 'hr@tigrow.com',
  //   password: 'Orvi@123456',
  // };
  // describe('# POST /api/v1/account/login', () => {
  //   it('should login in their account', done => {
  //     request(app)
  //       .post('/api/v1/accounts/login')
  //       .send(companyAccount)
  //       .end((err, res) => {
  //         userAccount.token = res.body.token;
  //         done();
  //       });
  //   });
  // });
});
