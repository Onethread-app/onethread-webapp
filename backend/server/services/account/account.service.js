const Account = require('../../account/account.model');
const { generateToken } = require('../../utils/utils.controller');
const client = require('../../../index.redis');
const logger = require('../../../config/winston');

const findAccountById = (_id) => {
  return Account.findById(_id)
    .select('-password')
    .populate(
      'skillArea jobExperience education',
      '_id name _id name companyName positionName currentlyWork startYear endingYear jobDescription degree institutionName eduDescription startYear endingYear currentlyStudy',
    );
};
const findAccountByIdAndUpdateAccountStatus = (_id) => {
  return Account.findByIdAndUpdate(
    { _id },
    { $set: { isAccountVerified: true } },
    { safe: true, upsert: true, new: true },
  );
};

const findAccountByIdAndUpdate = (_id, data) => {
  return Account.findByIdAndUpdate({ _id }, data, {
    safe: true,
    upsert: true,
    new: true,
  }).select('-password');
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

// Redis
// Set Verify Token
const setVerifyToken = async (token, data, tokenExpire) => {
  logger.info(`Set Verify Token: ${token} ${data} ${tokenExpire}`);
  return client.set(
    `verifyAccountToken:${token}`,
    data,
    'PX',
    tokenExpire,
  );
};

// Get Verify Token
const getVerifyToken = (token) => {
  logger.info(`Getting Verify Token: ${token}`);
  return client.multi().get(`verifyAccountToken:${token}`);
};

// Delete Verify Token
const deleteVerifyToken = async (token) => {
  logger.info(`Delete Verify Token: ${token}`);
  return client.del(`verifyAccountToken:${token}`);
};

// Any kind of token verify
const tokenVerify = async (token, data, tokenExpire) => {
  await client.set(token, data, 'PX', tokenExpire);
  logger.info(`token add into token verification key`);
};

const addTokenToBlackList = async (token, tokenExpire) => {
  await client.set(`BlackList:${token}`, token, 'PX', tokenExpire);
  logger.info(`access and refresh token add to blacklist`);
};

const storeUserSettingInCache = async (
  setting,
  account,
  tokenExpire,
) => {
  await client.set(`setting:${account}`, setting, 'PX', tokenExpire);
  logger.info(`Setting is stored in cache`);
};

module.exports = {
  findAccountById,
  findAccountByIdAndUpdateAccountStatus,
  findAccountByIdAndUpdate,
  findAccountByEmail,
  createAccountWithEmail,
  getVerifyToken,
  setVerifyToken,
  deleteVerifyToken,
  tokenVerify,
  addTokenToBlackList,
  storeUserSettingInCache,
};
