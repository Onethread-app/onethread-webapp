const Account = require('../../account/account.model');
const { generateToken } = require('../../utils/utils.controller');
const client = require('../../../index.redis');

const findAccountById = async (_id) => {
  return await Account.findById({
    _id: _id,
  })
    .select('-password')
    .populate(
      'skillArea jobExperience education',
      '_id name _id name companyName positionName currentlyWork startYear endingYear jobDescription degree institutionName eduDescription startYear endingYear currentlyStudy',
    )
    .exec();
};
const findAccountByIdAndUpdateAccountStatus = async (_id) => {
  return await Account.findByIdAndUpdate(
    { _id: _id },
    { $set: { isAccountVerified: true } },
    { safe: true, upsert: true, new: true },
  ).exec();
};

const findAccountByIdAndUpdate = async (_id, data) => {
  return await Account.findByIdAndUpdate(
    {
      _id: _id,
    },
    data,
    {
      safe: true,
      upsert: true,
      new: true,
    },
  )
    .select('-password')
    .exec();
};

const createAccountWithEmail = async (email) => {
  return Account.create({
    email,
    name: generateToken(), // Random name
    contactNo: generateToken(), // Random contactNo
  });
};

const findAccountByEmail = async (email) => {
  return Account.findOne({ email });
};

const verifyAccountToken = (token) => {
  return client.multi().get(`verifyAccountToken:${token}`);
};

const deleteAccountToken = (token) => {
  return client.del(`verifyAccountToken:${token}`);
};

module.exports = {
  findAccountById,
  findAccountByIdAndUpdateAccountStatus,
  findAccountByIdAndUpdate,
  findAccountByEmail,
  createAccountWithEmail,
  verifyAccountToken,
  deleteAccountToken,
};
