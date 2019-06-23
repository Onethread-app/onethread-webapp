// 'use strict';
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

// let token = "";
// before(done => {
//   // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
//   let credentials = {
//     email: "jest@gmail.com",
//     password: "jest1234"
//   };

//   request(app)
//     .post("/api/v1/account/login")
//     .send(credentials)
//     .expect(200)
//     .then(res => {
//       //expect(res.body.success).to.equal(true);
//       token = res.body.token;
//       done();
//     })
//     .catch(err => {
//       console.log(err);
//     })
//     .catch(done);
// });
// after(done => {
//   // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
//   mongoose.models = {};
//   mongoose.modelSchemas = {};
//   mongoose.connection.close();
//   done();
// });

// describe("## post APIs", () => {
//   let post = {
//     text: "KK",
//     location: "dhaka bang"
//   };

//   describe("# POST /api/psts", () => {
//     it("should create a new post", done => {
//       request(app)
//         .post("/api/v1/posts")
//         .set("Authorization", token)
//         .send(post)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.text).to.equal(post.text);
//           expect(res.body.location).to.equal(post.location);
//           post = res.body;
//           done();
//         })
//         .catch(function (err) {
//           console.error(err);
//           done(err);
//         })
//         .catch(done);
//     });
//   });

//   describe("# GET /api/posts/:postId", () => {
//     it("should get post details", done => {
//       request(app)
//         .get(`/api/v1/posts/${post._id}`)
//         .set("Authorization", token)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.text).to.equal(post.text);
//           expect(res.body.location).to.equal(post.location);
//           done();
//         })
//         .catch(done);
//     });
//   });

//   //   //   it('should report error with message - Not found, when post does not exists', (done) => {
//   //   //     request(app)
//   //   //       .get('/api/v1/posts/56c787ccc67fc16ccc1a5e92')
//   //   //       .expect(httpStatus.NOT_FOUND)
//   //   //       .then((res) => {
//   //   //         expect(res.body.message).to.equal('Not Found');
//   //   //         done();
//   //   //       })
//   //   //       .catch(done);
//   //   //   });
//   //   // });

//   describe("# PUT /api/v1/posts:postId", () => {
//     it("should update post details", done => {
//       post.postname = "KK";
//       request(app)
//         .put(`/api/v1/posts/${post._id}`)
//         .set("Authorization", token)
//         .send(post)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.text).to.equal("KK");
//           expect(res.body.location).to.equal(post.location);
//           done();
//         })
//         .catch(done);
//     });
//   });

//   describe("# GET /api/posts/", () => {
//     it("should get all posts", done => {
//       request(app)
//         .get("/api/v1/posts")
//         .set("Authorization", token)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body).to.be.an("array");
//           done();
//         })
//         .catch(done);
//     });

//     it("should get all posts (with limit and skip)", done => {
//       request(app)
//         .get("/api/v1/posts")
//         .set("Authorization", token)
//         .query({
//           limit: 10,
//           skip: 1
//         })
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body).to.be.an("array");
//           done();
//         })
//         .catch(done);
//     });
//   });

//   describe("# Like /api/posts/", () => {
//     it("should like post", done => {
//       request(app)
//         .get(`/api/v1/posts/likes/${post._id}`)
//         .set("Authorization", token)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.like)
//             .to.be.an("array")
//             .that.includes("5cdb98cdab24ca4b10407752");

//           done();
//         })
//         .catch(done);
//     });
//   });

//   describe("# Respects /api/posts/", () => {
//     it("should respect post", done => {
//       request(app)
//         .get(`/api/v1/posts/respectes/${post._id}`)
//         .set("Authorization", token)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.like)
//             .to.be.an("array")
//             .that.includes("5cdb98cdab24ca4b10407752");
//           done();
//         })
//         .catch(done);
//     });
//   });

//   describe("# DELETE /api/posts/", () => {
//     it("should delete post", done => {
//       request(app)
//         .delete(`/api/v1/posts/${post._id}`)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.text).to.equal("KK");
//           expect(res.body.location).to.equal(post.location);
//           done();
//         })
//         .catch(done);
//     });
//   });
// });