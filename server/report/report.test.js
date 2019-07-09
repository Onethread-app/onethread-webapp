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

// describe("## report APIs", () => {
//   let report = {
//     reportType: "false",
//     userRef: "5cdb99532325ce4cab3879cb",
//     postRef: "5cdb989faf732f49f137b820",
//     commentRef: "5ce0f1fee97dae22b9d82c86",
//     text: "hola"
//   };

//   describe("# SAVE /api/reports", () => {
//     let reportuser = Object.create({
//       refrence: report.userRef,
//       text: report.text,
//       reportType: "false"
//     });

//     it("should create a new report of post user refrence", done => {
//       request(app)
//         .post("/api/v1/reports")
//         .set("Authorization", token)
//         .query({ refType: "userRef" }) // need to change userRef id also
//         .send(reportuser)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.userRef).to.equal(report.userRef);
//           expect(res.body.reportType[0]).to.equal(report.reportType);
//           //report = res.body;
//           done();
//         })
//         .catch(err => {
//           console.log(err);
//         })
//         .catch(done);
//     });
//   });

//   describe("# SAVE /api/reports", () => {
//     let reportuser = Object.create({
//       reportType: "false",
//       refrence: report.commentRef,
//       text: report.text
//     });
//     it("should create a new report of post comment refrence", done => {
//       request(app)
//         .post("/api/v1/reports")
//         .set("Authorization", token)
//         .query({ refType: "commentRef" }) // need to change userRef id also
//         .send(reportuser)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.commentRef).to.equal(report.commentRef);
//           expect(res.body.reportType[0]).to.equal(report.reportType);
//           //report = res.body;
//           done();
//         })
//         .catch(done);
//     });
//   });

//   describe("# SAVE /api/reports", () => {
//     //let reportuser = {refrence : postRef , text : text} = report;
//     //let { userRef,commentRef, ...reportuser } = report; //rest not working
//     let reportuser = Object.create({
//       reportType: "false",
//       refrence: report.postRef,
//       text: report.text
//     });

//     it("should create a new report of post with post reference", done => {
//       request(app)
//         .post("/api/v1/reports")
//         .set("Authorization", token)
//         .query({ refType: "postRef" }) // need to change userRef id also
//         .send(reportuser)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.postRef).to.equal(report.postRef);
//           expect(res.body.reportType[0]).to.equal(report.reportType);
//           report = res.body;
//           done();
//         })
//         .catch(done);
//     });
//   });

//   describe("# GET /api/reports/:reportId", () => {
//     it("should get report details", done => {
//       request(app)
//         .get(`/api/v1/reports/${report._id}`)
//         .set("Authorization", token)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.postRef).to.equal(report.postRef);
//           done();
//         })
//         .catch(done);
//     });
//   });

//   describe("# GET /api/report/", () => {
//     it("should get all report post item", done => {
//       request(app)
//         .get("/api/v1/reports")
//         .set("Authorization", token)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body).to.be.an("array");
//           done();
//         })
//         .catch(done);
//     });

//     it("should get all reports (with limit and skip)", done => {
//       request(app)
//         .get("/api/v1/reports")
//         .set("Authorization", token)
//         .query({ limit: 10, skip: 1 })
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body).to.be.an("array");
//           done();
//         })
//         .catch(done);
//     });
//   });

  describe("# DELETE /api/reports/", () => {
    it("should delete save", done => {
      request(app)
        .delete(`/api/v1/reports/${report._id}`)
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
