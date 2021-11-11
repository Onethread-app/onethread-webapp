const logger = require('../../config/winston');
const { Team } = require('../team-member/team.model');
const { sendErrorResponse } = require('../helpers/jsonResponse');
const authorizeProjectRole = (functionalRole, ...userRoles) => {
  return async function (req, res, next) {
    try {
      const team = await Team.findOne({
        $and: [
          { account: req.user._id },
          { project: req.query.pid },
          { removed: false },
        ],
      });
      if (
        !team ||
        (functionalRole === 'all' && !userRoles.includes(team.role))
      ) {
        return sendErrorResponse(res, 403, 'PermissionError', {
          message: `Restricted`,
        });
      }
      req.team = team;
      next();
    } catch (error) {
      logger.error(`Project: ${error}`);
      next(error);
    }
  };
};

module.exports = {
  authorizeProjectRole,
};
