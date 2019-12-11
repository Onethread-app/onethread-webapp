const Account = require('../account/account.model');
module.exports.generateUsername = async function(
  firstName,
  lastName,
) {
  await Account.countDocuments({
    firstName: firstName,
    lastName: lastName,
  })
    .exec()
    .then(data => {
      let uniqueId = data;
      console.log(uniqueId);
      let username = firstName + '.' + lastName + '.';
      return username;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};
