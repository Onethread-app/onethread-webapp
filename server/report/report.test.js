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
after(done => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe("## post APIs", () => {
  let report = {
    userRef: "5cdb99532325ce4cab3879cb",
    text: 'hola'
  };

  describe("# SAVE /api/reports", () => {
    it("should create a new save of post", done => {
      request(app)
        .post("/api/v1/reports")
        .query({ refType: 'userRef' })  // need to change userRef id also
        .send(report)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.postRef).to.equal(report.postRef);
          report = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe("# GET /api/reports/:reportId", () => {
    it("should get save details", done => {
      request(app)
        .get(`/api/v1/reports/${report._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.postRef).to.equal(report.postRef);
          done();
        })
        .catch(done);
    });
  });

  describe("# GET /api/report/", () => {
    it("should get all report post item", done => {
      request(app)
        .get("/api/v1/reports")
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an("array");
          done();
        })
        .catch(done);
    });

    it("should get all reports (with limit and skip)", done => {
      request(app)
        .get("/api/v1/reports")
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an("array");
          done();
        })
        .catch(done);
    });
  });

  describe("# DELETE /api/reports/", () => {
    it("should delete save", done => {
      request(app)
        .delete(`/api/v1/reports/${report._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.postRef).to.equal(report.postRef);
          done();
        })
        .catch(done);
    });
  });
});
