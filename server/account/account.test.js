"use strict";

const mongoose = require("mongoose");
const request = require("supertest-as-promised");
const chai = require("chai"); // eslint-disable-line import/newline-after-import
const app = require("../../index");

// chai.config.includeStack = true;

// /**
//  * root level hooks
//  */

after(done => {
	// required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
	mongoose.models = {};
	mongoose.modelSchemas = {};
	mongoose.connection.close();
	done();
});
describe("## Registration APIs for User", () => {
	let userAccount = {
		email: "orias@gmil.com",
		password: "Orvi@1234",
		role: "user"
	};
	describe("# POST /api/v1/account/signup", () => {
		it("should create an account", done => {
			request(app)
				.post(`/api/v1/account/signup`)
				.send(userAccount)
				.end((err, res) => {
					userAccount = res.body.createdUser;
					done();
				});
		});
	});

	let companyAccount = {
		email: "fb@fb.com",
		password: "Orvi@1234",
		role: "company"
	};
	describe("# POST /api/v1/account/signup", () => {
		it("should create an account", done => {
			request(app)
				.post(`/api/v1/account/signup`)
				.send(companyAccount)
				.end((err, res) => {
					companyAccount = res.body.createdUser;
					done();
				});
		});
	});
});
