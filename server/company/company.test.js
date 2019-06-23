// 'use strict';
// const mongoose = require("mongoose");
// const request = require("supertest-as-promised");
// const httpStatus = require("http-status");
// const chai = require("chai");
// const expect = chai.expect; // eslint-disable-line import/newline-after-import

// const app = require("../../index");

// chai.config.includeStack = true;

// /**
//  * root level hooks
//  */

// let token = "";
// before(done => {
//   // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
//   let credentials = {
//     email: "face@fb.com",
//     password: "Orvi@123456"
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
  
// describe("## Company USER APIs", () => {
//   let companyInfo = {
//    companyName : "tigrow",
//    phoneNumber : "8801673754716",
//    companyAddress: "mohakhali dohs",
//    establishDate : "2019",
//    selectDistrict : "Dhaka",
//    selectThana : "banani",
//    businessDescription: "Social networking site",
//    tradeLicense : "100000000",
//    contactPersonName : "orvi",
//    contactPersonDesignation : "software developer",
//    contactPersonEmail : "das.orvi@yahoo.com",
//    contactPersonMobile : "8801683754716",
//    accountRef : "12345678"

//   };

//   describe("# POST CompanyUserInfo /api/v1/company/profile/", () => {
//     it("should create a new user", done => {
//       request(app)
//         .post("/api/v1/company/profile/")
//         .set("Authorization", token)
//         .send(companyInfo)
//         .expect(httpStatus.OK)
//         .then(res => {
//           companyInfo = res.body;
//           done();
//         })
//         .catch(function(err) {
//           console.error(err);
//           done(err);
//         })
//         .catch(done);
//     });
//   });

//   describe("# GET /api/v1/company/profile/:id", () => {
//     it("should get company details", done => {
//       request(app)
//         .get('/api/v1/company/profile/5d0886c2c3c17d265a7de20e')
//         .set("Authorization", token)
//         .expect(httpStatus.OK)
//         .then(res => {
//           expect(res.body.companyName).to.equal(companyInfo.companyName);
//           done();
//         })
//         .catch(done);
//     });
//   });
// });
// });



// after(done => {
//   // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
//   mongoose.models = {};
//   mongoose.modelSchemas = {};
//   mongoose.connection.close();
//   done();
// });