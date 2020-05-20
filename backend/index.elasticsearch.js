const {
  checkConnection,
  accountIndex,
  memberIndex,
  createAccounts,
  createMembers,
  accountMapping,
  memberMapping,
  createSkillareas,
  skillIndex,
  skillMapping,
  createCompany,
  companyIndex,
  companyMappnig,
  createAssociate,
  associateIndex,
  associateMapping
} = require('./server/services/elastic.services');
const Account = require('./server/account/account.model');
const { Member } = require('./server/company/member/member.model');
const SkillArea = require('./server/skillArea/skillArea.model');
const { Company } = require('./server/company/company.model');
const { Associate } = require('./server/associate/associate.model');

async function IndexElasticSearch() {
  const isElasticReady = await checkConnection();
  if (isElasticReady) {
    await createAccounts(accountIndex, accountMapping, Account);
    await createMembers(memberIndex, memberMapping, Member);
    await createSkillareas(skillIndex, skillMapping, SkillArea);
    await createCompany(companyIndex, companyMappnig, Company);
    await createAssociate(associateIndex, associateMapping, Associate);
  }
}

module.exports = {
  IndexElasticSearch,
};
