const Account = require('../../account/account.model');
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
module.exports = {
  findAccountById,
  findAccountByIdAndUpdateAccountStatus,
  findAccountByIdAndUpdate,
};
