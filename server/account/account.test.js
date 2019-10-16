const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const app = require('../../index');

// const request = require("supertest-as-promised");
// const httpStatus = require("http-status");
// const chai = require("chai"); // eslint-disable-line import/newline-after-import
// const expect = chai.expect;
// const app = require("../../index.js");

// chai.config.includeStack = true;

// /**
//  * root level hooks
//  */

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
  describe('# POST /api/v1/account/signup', () => {
    it('should create an account', done => {
      request(app)
        .post('/api/v1/account/signup')
        .send(userAccount)
        .end((err, res) => {
          userAccount = res.body.createdUser;
          done();
        });
    });
  });

  let companyAccount = {
    firstName: 'orvi',
    lastName: 'das',
    email: 'hr@tigrow.com',
    password: 'Orvi@123456',
    confirmPassword: 'Orvi@123456',
    contactNo: '+8801683754716',
  };
  describe('# POST /api/v1/account/signup', () => {
    it('should create an account', done => {
      request(app)
        .post('/api/v1/account/signup')
        .send(companyAccount)
        .end((err, res) => {
          companyAccount = res.body.createdUser;
          done();
        });
    });
  });
});

describe('## Login APIs for Account Holders', () => {
  let userAccount = {
    email: 'robatdas2018@gmail.com',
    password: 'Orvi@123456',
  };
  describe('# POST /api/v1/account/login', () => {
    it('should login in their account', done => {
      request(app)
        .post('/api/v1/account/login')
        .send(userAccount)
        .end((err, res) => {
          userAccount.token = res.body.token;
          done();
        });
    });
  });
  let companyAccount = {
    email: 'hr@tigrow.com',
    password: 'Orvi@123456',
  };
  describe('# POST /api/v1/account/login', () => {
    it('should login in their account', done => {
      request(app)
        .post('/api/v1/account/login')
        .send(companyAccount)
        .end((err, res) => {
          userAccount.token = res.body.token;
          done();
        });
    });
  });
});
