const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');

chai.config.includeStack = true;

after((done)=>{
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.connection.close();
    done();
});

describe('## account registration', ()=>{
    let account = {
        email: 'o@o.com',
        password: 'orvi123456',
        role: 'user',
        account_type: 'normal'
    };
    describe('# create an account',()=>{
        it('should create an new account', (done)=>{
            request(app)
                .post(`/api/v1/account/signup`)
                .except(httpStatus.OK)
                .then((res)=>{
                    expect(res).to.have.status(201);
                    expect(res.body.message).to.be.equal("User created!");
                    expect(res.body.errors.length).to.be.equal(0);
                    done();
                }).catch(err => {
                    console.log(err.message);
                 })
        })
    })

})
