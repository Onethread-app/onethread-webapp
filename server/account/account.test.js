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
describe("## Registration APIs", () =>{
    let account = {
        email: "orias@gmil.com",
        password: "Orvi@1234",
        role: "user"
    };
    describe("# POST /api/v1/account/signup", () => {
        it("should create an account", done => {
          request(app)
            .post(`/api/v1/account/signup`)
            .send(account)
            .end((err, res) => {
                account = res.body.createdUser;
                done();
          });
            
        });
      });
      
});

