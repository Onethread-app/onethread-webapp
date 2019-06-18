'use strict';
const mongoose = require("mongoose");
const request = require("supertest-as-promised");
const httpStatus = require("http-status");
const chai = require("chai"); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require("../../index.js");

chai.config.includeStack = true;

/**
 * root level hooks
 */
after(done => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe("## Category APIs", () => {
  let user = {
    email: "jest@gmail.com",
    password: "jest1234"
  };
  // login
  describe("# POST /api/v1/account/login", () => {
    it("should return status and token", done => {
      request(app)
        .post("/api/v1/account/login")
        .send(user)
        .expect(httpStatus.OK)
        .then(res => {
          const body = res.body;
          expect(body).to.contain.property("success");
          expect(body).to.contain.property("token");
          expect(body.success).to.equal(true);
          user.token = body.token;
          done();
        })
        .catch(done);
    });
  });

  // all
  describe("# GET /api/v1/category?type=", () => {
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

    // it("should return status 400 [/category] (without type in query string)", done => {
    //   request(app)
    //     .get("/api/v1/category")
    //     .expect(httpStatus.BAD_REQUEST)
    //     .then(res => {
    //       const body = res.body;
    //       expect(body).to.contain.property("message");
    //       expect(body.message).to.equal("Expects 'type' in query string");
    //       done();
    //     })
    //     .catch(done);
    // });
    it("should return status 200 [/category?type=user] (for USER)", done => {
      request(app)
        .get("/api/v1/category?type=user")
        .expect(httpStatus.OK)
        .then(res => {
          const body = res.body;
          expect(body).to.contain.property("type");
          expect(body).to.contain.property("categories");
          expect(body.type).to.equal("user");
          done();
        })
        .catch(done);
    });
    it("should return status 200 [/category?type=company] (for COMPANY)", done => {
      request(app)
        .get("/api/v1/category?type=company")
        .expect(httpStatus.OK)
        .then(res => {
          const body = res.body;
          expect(body).to.contain.property("type");
          expect(body).to.contain.property("categories");
          expect(body.type).to.equal("company");
          done();
        })
        .catch(done);
    });
  });

  // // delete a user
  // describe("# DELETE /api/v1/user/:userId", () => {
  //   it("should return status 401 (without token)", done => {
  //     request(app)
  //       .delete(`/api/v1/user/${user._id}`)
  //       .expect(httpStatus.UNAUTHORIZED)
  //       .then(res => {
  //         expect(res.text).to.equal("Unauthorized");
  //         done();
  //       })
  //       .catch(done);
  //   });

  //   it("should return status 500 (With valid token and invalid ID )", done => {
  //     request(app)
  //       .delete(`/api/v1/user/5ce2480905dfdb2f38b6a9af`)
  //       .set("Authorization", user.token)
  //       .expect(httpStatus.INTERNAL_SERVER_ERROR)
  //       .then(res => {
  //         const body = res.body;
  //         expect(body).to.contain.property("message");
  //         expect(body.message).to.equal("No user found to delete");
  //         done();
  //       })
  //       .catch(done);
  //   });

  //   it("should delete a user (With ID & token)", done => {
  //     request(app)
  //       .delete(`/api/v1/user/${user._id}`)
  //       .set("Authorization", user.token)
  //       .expect(httpStatus.OK)
  //       .then(res => {
  //         const body = res.body;
  //         expect(body).to.contain.property("message");
  //         expect(body.message).to.equal("User deleted");
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });
  // test ends
});
