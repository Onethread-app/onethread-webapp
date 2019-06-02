const mongoose = require("mongoose");
const request = require("supertest-as-promised");
const httpStatus = require("http-status");
const chai = require("chai"); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require("../../index");

chai.config.includeStack = true;

/**
 * root level hooks
 */

let token = "";
before(done => {
    let credentials = {
        email: "jest@gmail.com",
        password: "jest1234",
        type: "user"
      };
      request(app)
      .post("/api/v1/account/login")
      .send(credentials)
      .expect(200)
      .then(res => {
        //expect(res.body.success).to.equal(true);
        token = res.body.token;
        done();
      })
      .catch(err => {
        console.log(err);
      })
      .catch(done);
});