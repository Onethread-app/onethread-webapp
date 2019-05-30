// const mongoose = require("mongoose");
// const request = require("supertest-as-promised");
// const httpStatus = require("http-status");
// const chai = require("chai"); // eslint-disable-line import/newline-after-import
// const expect = chai.expect;
// const app = require("../../index.js");

// chai.config.includeStack = true;

// /**
//  * root level hooks
//  */

// before(done =>{
//     let account ={
//         email: "orvi@orvi.com",
//         password: "Orvi@1234",
//         role: "user",
//     };
//     request(app)
//         .post("/api/v1/account/signup")
//         .send(account)
//         .expect(httpStatus.OK)
// })