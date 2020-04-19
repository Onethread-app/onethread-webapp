const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const app = require('../../index');
const httpStatus = require('http-status');

after((done) => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});
describe('## Registration APIs for User', () => {
  let userAccount = {
    firstName: 'orvi',
    lastName: 'das',
    email: 'robatdas2018@gmail.com',
    password: 'Orvi@123456',
    confirmPassword: 'Orvi@123456',
    contactNo: '+8801683754716',
  };
  describe('# POST /api/v1/accounts/signup', () => {
    it('should not create an account because of duplicate email', (done) => {
      request(app)
        .post('/api/v1/accounts/signup')
        .send(userAccount)
        .expect(httpStatus.CONFLICT)
        .then((res) => {
          res.type = 'DuplicateKeyError';
          done();
        })
        .catch(done);
    });
  });
  let userAccount89 = {
    firstName: 'orvi',
    lastName: 'das',
    email: `robatdas${Date.now()}@gmail.com`,
    password: 'Orvi@123456',
    confirmPassword: 'Orvi@123456',
    contactNo: '+8801683754716',
  };
  it('should not create an account because of duplicate contactNo', (done) => {
    request(app)
      .post('/api/v1/accounts/signup')
      .send(userAccount89)
      .expect(httpStatus.CONFLICT)
      .then((res) => {
        res.text.type = 'DuplicateKeyError';
        done();
      })
      .catch(done);
  });
  let userAccount1 = {
    firstName: '',
    lastName: 'das',
    email: `robatdas${Date.now()}@gmail.com`,
    password: 'Orvi@123456',
    confirmPassword: 'Orvi@123456',
    contactNo: ``,
  };
  it('should not create an account because of firstName is not a valid format', (done) => {
    request(app)
      .post('/api/v1/accounts/signup')
      .send(userAccount1)
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        res.type = 'ValidationError';
        done();
      })
      .catch(done);
  });
  let userAccount12 = {
    firstName: '1111',
    lastName: '',
    email: `robatdas${Date.now()}@gmail.com`,
    password: 'Orvi@123456',
    confirmPassword: 'Orvi@123456',
    contactNo: `${Math.random().toString().slice(2, 11)}`,
  };
  it('should not create an account because of lastName is not a valid format', (done) => {
    request(app)
      .post('/api/v1/accounts/signup')
      .send(userAccount12)
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        res.type = 'ValidationError';
        done();
      })
      .catch(done);
  });
  const phoneNumber = `+880${Math.floor(
    Math.random() * 10000000000,
  )}`;
  let userAccount2 = {
    firstName: 'orvi',
    lastName: 'das',
    email: `robatdas${Date.now()}@gmail.com`,
    password: 'Orvi@123456',
    confirmPassword: 'Orvi@123456',
    contactNo: phoneNumber,
  };
  it('should create an account', (done) => {
    request(app)
      .post('/api/v1/accounts/signup')
      .send(userAccount2)
      .expect(httpStatus.CREATED)
      .then((res) => {
        userAccount2 = res.body.user;
        done();
      })
      .catch(done);
  });
  let userAccount3 = {
    firstName: 'orvi',
    lastName: 'das',
    email: '',
    password: 'Orvi@123456',
    confirmPassword: 'Orvi@123456',
    contactNo: '+8801683754716',
  };
  describe('# POST /api/v1/accounts/signup', () => {
    it('Email id is invalid so should not create an account', (done) => {
      request(app)
        .post('/api/v1/accounts/signup')
        .send(userAccount3)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          userAccount3.type = res.body.type;
          done();
        })
        .catch(done);
    });
  });
  let userAccount4 = {
    firstName: '',
    lastName: 'das',
    email: '',
    password: 'Orvi@123456',
    confirmPassword: 'Orvi@123456',
    contactNo: '+8801683754716',
  };
  describe('# POST /api/v1/accounts/signup', () => {
    it('contactNo is invalid so should not create an account ', (done) => {
      request(app)
        .post('/api/v1/accounts/signup')
        .send(userAccount4)
        .expect(httpStatus.BAD_REQUEST)
        .end((err, res) => {
          userAccount4.type = res.body.type;
          done();
        });
    });
  });
});

describe('## Login APIs for Account Holders', () => {
  let userAccount3 = {
    email: 'robatdas2018@gmail.com',
    password: 'Labiba@123',
  };
  describe('# POST /api/v1/accounts/login', () => {
    it('should login in their account', (done) => {
      request(app)
        .post('/api/v1/accounts/login')
        .send(userAccount3)
        .end((err, res) => {
          userAccount3.token = res.body.token;
          done();
        });
    });
  });
  let Account1 = {
    email: 'hr@tigrow.com',
    password: 'Orvi@123456',
  };
  describe('# POST /api/v1/account/login', () => {
    it('should tell an auth Error', (done) => {
      request(app)
        .post('/api/v1/accounts/login')
        .send(Account1)
        .end((err, res) => {
          Account1.token = res.body.token;
          done();
        });
    });
  });
  let Account2 = {
    email: 'robatdas2018@gmail.com',
    password: 'Labiba@123',
  };
  describe('# POST /api/v1/account/login', () => {
    it('should login in his account', (done) => {
      request(app)
        .post('/api/v1/accounts/login')
        .send(Account2)
        .expect(httpStatus.OK)
        .end((err, res) => {
          Account2.token = res.body.token;
          done();
        });
    });
  });
  describe('Only validate account holder can access', () => {
    let accessToken;
    let userAccount34 = {
      email: 'robatdas18@gmail.com',
      password: 'Orvi@123',
    };
    beforeEach((done) => {
      request(app)
        .post('/api/v1/accounts/login')
        .send(userAccount34)
        .expect(httpStatus.OK)
        .then((res) => {
          accessToken = res.body.token;
          done();
        })
        .catch(done);
    });
    describe('POST /api/v1/accounts/update', () => {
      it('it should update the account information', (done) => {
        request(app)
          .put('/api/v1/accounts/update')
          .set('Authorization', `${accessToken}`)
          .send({
            firstName: 'orvi',
            lastName: 'dass',
          })
          .expect(httpStatus.OK)
          .then((res) => {
            res.message = 'profile updated';
            done();
          })
          .catch(done);
      });
      it('it should not update the account information because no valid token provided', (done) => {
        request(app)
          .put('/api/v1/accounts/update')
          .send({
            firstName: 'ori',
            lastName: 'ds',
          })
          .expect(httpStatus.UNAUTHORIZED)
          .then((res) => {
            res.type = 'AuthError';
            done();
          })
          .catch(done);
      });
      it('it should not update the account information because firstName is less than 3 character', (done) => {
        request(app)
          .put('/api/v1/accounts/update')
          .set('authorization', `${accessToken}`)
          .send({
            firstName: 'or',
            lastName: 'ds',
          })
          .expect(httpStatus.BAD_REQUEST)
          .then((res) => {
            res.type = 'ValidationError';
            done();
          })
          .catch(done);
      });
      it('it should not update the account information because lastName is less than 3 character', (done) => {
        request(app)
          .put('/api/v1/accounts/update')
          .set('authorization', `${accessToken}`)
          .send({
            firstName: 'orv',
            lastName: 'ds',
          })
          .expect(httpStatus.BAD_REQUEST)
          .then((res) => {
            res.type = 'ValidationError';
            done();
          })
          .catch(done);
      });
      it('it should update the location bloodGroup, about, gender, location', (done) => {
        request(app)
          .put('/api/v1/accounts/update')
          .set('authorization', `${accessToken}`)
          .send({
            firstName: 'orv',
            lastName: 'das',
            bloodGroup: 'B+',
            location: 'Mohakhali',
            about: 'I am awesome',
            gender: 'Others',
          })
          .expect(httpStatus.BAD_REQUEST)
          .then((res) => {
            res.type = 'ValidationError';
            done();
          })
          .catch(done);
      });
      it('it should not update because secondaryEmail is not a valid format', (done) => {
        request(app)
          .put('/api/v1/accounts/update')
          .set('authorization', `${accessToken}`)
          .send({
            secondaryEmail: `a*c`,
          })
          .expect(httpStatus.BAD_REQUEST)
          .then((res) => {
            res.type = 'ValidationError';
            done();
          })
          .catch(done);
      });
    });
    describe('GET /api/v1/accounts', () => {
      it('Account holder can view his account information', (done) => {
        request(app)
          .get('/api/v1/accounts')
          .set('authorization', `${accessToken}`)
          .expect(httpStatus.OK)
          .then((res) => {
            res.text.success = res.body.success;
            done();
          })
          .catch(done);
      });
      it('Account holder can not see his information due to invalid token', (done) => {
        request(app)
          .get('/api/v1/accounts')
          .set('authorization', ``)
          .expect(httpStatus.UNAUTHORIZED)
          .then((res) => {
            res.type = 'AuthError';
            done();
          })
          .catch(done);
      });
      it('Account holder did not provide a valid token ', (done) => {
        request(app)
          .get('/api/v1/accounts')
          .set('authorization', `1223333`)
          .expect(httpStatus.UNAUTHORIZED)
          .then((res) => {
            res.type = 'AuthError';
            done();
          })
          .catch(done);
      });
    });
  });
  describe('Account holder forget his password', () => {
    let token;
    let UserID;
    before((done) => {
      request(app)
        .post('/api/v1/accounts/forget-password')
        .send({ email: Account2.email })
        .expect(httpStatus.OK)
        .then((res) => {
          token = res.body.dbSavedUser.resetPasswordToken;
          done();
        })
        .catch(done);
    });
    describe('Account holder get permission to change his password', () => {
      it('GET /api/v1/accounts/forget-password/:token', (done) => {
        request(app)
          .get(`/api/v1/accounts/forget-password/${token}`)
          .expect(httpStatus.OK)
          .then((res) => {
            UserID = res.body.user._id;
            done();
          })
          .catch(done);
      });
    });
    describe('Account holder change his password', () => {
      it('GET /api/v1/accounts/reset-password/', (done) => {
        request(app)
          .put(`/api/v1/accounts/reset-password/`)
          .send({
            password: 'newPassword!QAZ6yhn8ikl',
            confirmPassword: 'newPassword!QAZ6yhn8ikl',
            userID: UserID,
          })
          .expect(httpStatus.OK)
          .then((res) => {
            res.message = res.body.message;
            done();
          })
          .catch(done);
      });
    });
    describe('Account holder has no permission to view this page', () => {
      it('GET /api/v1/accounts/forget-password/:token', (done) => {
        request(app)
          .get(`/api/v1/accounts/forget-password/1111`)
          .expect(httpStatus.BAD_REQUEST)
          .then((res) => {
            res.message = res.body.message;
            done();
          })
          .catch(done);
      });
    });
  });
});
