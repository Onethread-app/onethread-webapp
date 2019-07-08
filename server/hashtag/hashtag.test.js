<<<<<<< HEAD
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

describe("## Hashtag APIs", done => {
  let hashtag = {
    text: "pasi"
  };

  // describe("# Hashtag /api/hashtags", () => {
  //   it("should create a new hashtag of post", done => {
  //     request(app)
  //       .post("/api/v1/hashtags")
  //       .set("Authorization", token)
  //       .send(hashtag)
  //       .expect(httpStatus.OK)
  //       .then(res => {
  //         expect(res.body.text).to.equal(hashtag.text);
  //         save = res.body;
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });

  describe("# GET /api/hashtags/", () => {
    it("should get all hashtags (with limit and skip)", done => {
      request(app)
        .get("/api/v1/hashtags")
        .set("Authorization", token)
        .query({ text: "ha" })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an("array");
          //expect(res.body).to.have.deep.property('[0].text', 'hasi');
          done();
        })
        .catch(done);
    });
  });

  //   describe("# DELETE /api/saves/", () => {
  //     it("should delete save", done => {
  //       request(app)
  //         .delete(`/api/v1/saves/${save._id}`)
  //         .set("Authorization", token)
  //         .expect(httpStatus.OK)
  //         .then(res => {
  //           expect(res.body.postRef).to.equal(save.postRef);
  //           done();
  //         })
  //         .catch(done);
  //     });
  //   });
});
=======
// "use strict";
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

// describe("## Hashtag APIs", done => {
//   let hashtag = {
//     text: "pasi"
//   };

//   // describe("# Hashtag /api/hashtags", () => {
//   //   it("should create a new hashtag of post", done => {
//   //     request(app)
//   //       .post("/api/v1/hashtags")
//   //       .set("Authorization", token)
//   //       .send(hashtag)
//   //       .expect(httpStatus.OK)
//   //       .then(res => {
//   //         expect(res.body.text).to.equal(hashtag.text);
//   //         save = res.body;
//   //         done();
//   //       })
//   //       .catch(done);
//   //   });
//   // });

//   describe("# GET /api/hashtags/", () => {
//     it("should get all hashtags (with limit and skip)", done => {
//       request(app)
//         .get("/api/v1/hashtags")
//         .set("Authorization", token)
//         .query({ text: "ha" })
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body).to.be.an("array");
//           //expect(res.body).to.have.deep.property('[0].text', 'hasi');
//           done();
//         })
//         .catch(done);
//     });
//   });

//   //   describe("# DELETE /api/saves/", () => {
//   //     it("should delete save", done => {
//   //       request(app)
//   //         .delete(`/api/v1/saves/${save._id}`)
//   //         .set("Authorization", token)
//   //         .expect(httpStatus.OK)
//   //         .then(res => {
//   //           expect(res.body.postRef).to.equal(save.postRef);
//   //           done();
//   //         })
//   //         .catch(done);
//   //     });
//   //   });
// });
>>>>>>> remotes/origin/finalOrvi
