const Account = require('../../account/account.model');
const findAccountById = async (_id) => {
  return await Account.findById({
    _id: _id,
  })
    .select('firstName lastName')
    .exec();
};
module.exports = {
  findAccountById,
};
