const { Member } = require('../company/member/member.model');
const authorizeUser = (functionalRole, ...userRoles) => {
  return async function (req, res, next) {
    try {
      const member = await Member.findOne({
        account: req.user._id,
        company:
          req.headers.companyid ||
          req.params.companyId ||
          req.body.companyId, //apatoto pore name or id hobe
      }).exec();
      if (
        !member ||
        (functionalRole === 'all' && !userRoles.includes(member.role))
      ) {
        return sendErrorResponse(res, 403, 'PermissionError', {
          message: `Restricted`,
        });
      }
      next();
    } catch (error) {
      logger.error(`Company: ${error}`);
      next(error);
    }
  };
};

module.exports = {
  authorizeUser,
};
