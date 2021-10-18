const { Member } = require('../../../company/member/member.model');

const companyFindByIdAndDelete = (id) => {
  return Member.findByIdAndDelete(id);
};

module.exports = {
  companyFindByIdAndDelete,
};
