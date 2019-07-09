// const mongoose = require("mongoose");
// const request = require("supertest-as-promised");
// const httpStatus = require("http-status");
// const chai = require("chai"); // eslint-disable-line import/newline-after-import
// const expect = chai.expect;
// const app = require("../../index");

// chai.config.includeStack = true;

// /**
//  * root level hooks
//  */
// after(done => {
//   // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
//   mongoose.models = {};
//   mongoose.modelSchemas = {};
//   mongoose.connection.close();
//   done();
// });

// describe("## post APIs", () => {
//   let comment = {
//     text: "ck",
//     postRef: "5cdb989faf732f49f137b820"
//   };

//   describe("# SAVE /api/comments", () => {
//     it("should create a new save of comment", done => {
//       request(app)
//         .post("/api/v1/comments")
//         .send(comment)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.postRef).to.equal(comment.postRef);
//           expect(res.body.text).to.equal(comment.text);
//           comment = res.body;
//           done();
//         })
//         .catch(done);
//     });
//   });

//   describe("# GET /api/comments/:commentId", () => {
//     it("should get save details", done => {
//       request(app)
//         .get(`/api/v1/comments/${comment._id}`)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.postRef).to.equal(comment.postRef);
//           expect(res.body.text).to.equal(comment.text);
//           done();
//         })
//         .catch(done);
//     });
//   });

//   describe("# GET /api/comments/", () => {
//     it("should get all saves comments item", done => {
//       request(app)
//         .get("/api/v1/comments")
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body).to.be.an("array");
//           done();
//         })
//         .catch(done);
//     });

//     it("should get all comments (with limit and skip)", done => {
//       request(app)
//         .get("/api/v1/comments")
//         .query({ limit: 10, skip: 1 })
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body).to.be.an("array");
//           done();
//         })
//         .catch(done);
//     });
//   });

<<<<<<< HEAD
    it("should get all comments (with limit and skip)", done => {
      request(app)
        .get("/api/v1/comments")
        .set("Authorization", token)
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an("array");
          done();
        })
        .catch(done);
    });
  });

  describe("# Like /api/comments/", () => {
    it("should like comment", done => {
      request(app)
        .get(`/api/v1/comments/likes/${comment._id}`)
        .set("Authorization", token)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.like)
            .to.be.an("array")
            .that.includes("5cdb98cdab24ca4b10407752");

          done();
        })
        .catch(done);
    });
  });

  describe("# Respects /api/comments/", () => {
    it("should respect post", done => {
      request(app)
        .get(`/api/v1/comments/respectes/${comment._id}`)
        .set("Authorization", token)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.like)
            .to.be.an("array")
            .that.includes("5cdb98cdab24ca4b10407752");
          done();
        })
        .catch(done);
    });
  });

  describe("# DELETE /api/comments/", () => {
    it("should delete comment", done => {
      request(app)
        .delete(`/api/v1/comments/${comment._id}`)
        .set("Authorization", token)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.removed).to.equal(true);
          done();
        })
        .catch(done);
    });
  });
});
=======
//   describe("# DELETE /api/comments/", () => {
//     it("should delete comment", done => {
//       request(app)
//         .delete(`/api/v1/comments/${comment._id}`)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.postRef).to.equal(comment.postRef);
//           done();
//         })
//         .catch(done);
//     });
//   });
// });
>>>>>>> 7da9b12151907919ecd25125bd4170c4742780c2
