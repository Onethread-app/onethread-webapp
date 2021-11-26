const { Associate } = require('../../associate/associate.model');
const findByAssociateId = async (_id) => {
  return await Associate.findById(_id)
    .select('_id company associateCompany createdAt account')
    .populate(
      'associateCompany',
      '_id name type address email legalOwnerName legalOwnerMail',
    )
    .populate(
      'company',
      '_id name type address email legalOwnerName legalOwnerMail',
    )
    .populate('account', 'firstName lastName')
    .exec();
};

module.exports = {
  findByAssociateId,
};
