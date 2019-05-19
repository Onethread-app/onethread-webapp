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
  let save = {
    postRef: "5cdb989faf732f49f137b820"
  };

  describe("# SAVE /api/saves", () => {
    it("should create a new save of post", done => {
      request(app)
        .post("/api/v1/saves")
        .send(save)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.postRef).to.equal(save.postRef);
          save = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe("# GET /api/saves/:saveId", () => {
    it("should get save details", done => {
      request(app)
        .get(`/api/v1/saves/${save._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.postRef).to.equal(save.postRef);
          done();
        })
        .catch(done);
    });
  });

  describe("# GET /api/saves/", () => {
    it("should get all saves post item", done => {
      request(app)
        .get("/api/v1/saves")
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an("array");
          done();
        })
        .catch(done);
    });

    it("should get all saves (with limit and skip)", done => {
      request(app)
        .get("/api/v1/saves")
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an("array");
          done();
        })
        .catch(done);
    });
  });

  describe("# DELETE /api/saves/", () => {
    it("should delete save", done => {
      request(app)
        .delete(`/api/v1/saves/${save._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.postRef).to.equal(save.postRef);
          done();
        })
        .catch(done);
    });
  });
});
