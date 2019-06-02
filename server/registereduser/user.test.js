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
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  let credentials = {
    email: "jest@gmail.com",
    password: "jest1234"
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
after(done => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe("## USER APIs", () => {
  let post = {
    name: "orvi das",
    gender: "m",
    skillArea: "node.js",
    mobileNumber: "8801683754716",
    secondaryEmail: "o@c.com",
    birthday: "12/06/1994",
    about: "eiiii seiii seii",
    bio: "ami good"

  };

  describe("# POST /api/v1/profile/:id", () => {
    it("should create a new user", done => {
      request(app)
        .post("/api/v1/profile/:id")
        .set("Authorization", token)
        .send(post)
        .expect(httpStatus.OK)
        .then(res => {
          post = res.body;
          done();
        })
        .catch(function(err) {
          console.error(err);
          done(err);
        })
        .catch(done);
    });
  });
})