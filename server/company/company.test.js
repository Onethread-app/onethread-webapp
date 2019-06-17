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
    email: "orvi12@gmail.com",
    password: "orvi123456"
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
  
describe("## USER APIs", () => {
  let userInfo = {
    name: "orvi das",
    gender: "m",
    skillArea: "node.js",
    mobileNumber: "8801683754716",
    secondaryEmail: "o@c.com",
    birthday: "12/06/1994",
    about: "eiiii seiii seii",
    bio: "ami good"

  };

  describe("# POST UserInfo", () => {
    it("should create a new user", done => {
      request(app)
        .post("/api/v1/users/profile/:id")
        .set("Authorization", token)
        .send(userInfo)
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

  let userUpdateInfo = {
    name: "orvi tigrow",
    gender: "m",
    skillArea: "node.js",
    mobileNumber: "8801683754716",
    secondaryEmail: "o@c.com",
    birthday: "12/06/1994",
    about: "eiiii seiii seii",
    bio: "ami good"
  }
  describe("POST userInfo", () => {
    it("Should update userInfo", done => {
      request(app)
        .put("/api/v1/users/profile/:id")
        .set("Authorization", token)
        .send(userUpdateInfo)
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
    })

  })
})
});



after(done => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});