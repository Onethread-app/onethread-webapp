const chalk = require('chalk');
const Account = require('../../account/account.model');
const {Member} = require('./member.model');
const {Room} = require('../../room/room.model');
const {Company} = require('../company.model');
const logger = require('../../../config/winston');
const {
    sendJSONresponse,
    sendErrorResponse,
} = require('../../helpers/jsonResponse');
const {
    search,
    bulkInsert,
    accountIndex,
    memberIndex,
    deleteDocument,
} = require('../../services/elastic.services');
const {
    createMemberAddNotification,
} = require('../../notification/notification.controller');

const {PendingMember} = require('./pendingMember.model');
const {sendInviteColleague} = require('../../services/email.services');

const changeRole = async (req, res, next) => {
    try {
        // check role: superAdmin/admin
        const member = await Member.findOne({
            account: req.user._id,
            company: req.company._id,
        });

        if (req.body.role === 'admin' && member.role !== 'superAdmin') {
            return res.status(403).json({
                message: 'Restricted',
            });
        }

        req.member.role = req.body.role;

        await req.member.save();

        return res.status(201).json({
            message: `Role updated to ${req.body.role}`,
        });
    } catch (error) {
        logger.error(`${error}`);
        next(error);
    }
};

const addMember = async (req, res, next) => {
    // Check for JSON
    if (!req.is('application/json')) {
        return sendErrorResponse(res, 406, 'ContentTypeError', {
            message: "Expects 'application/json'",
        });
    }
    try {
        if (!req.body.members.length && !req.body.pendingTeamMembers) {
            return res.status(400).json({
                message: 'No members or newMembers found',
            });
        }

        let members = [];

        let accounts = [];

        let pendingMembers = [];

        if (req.body.members.length) {
            let newMembers = req.body.members;

            accounts = newMembers.map((member) => member.account);

            // find previous members
            let prevMembers = await Member.find({
                account: {$in: accounts},
                company: req.company._id,
                removed: true,
            }).select('account');

            prevMembers = prevMembers.map((member) => member.account);

            // filter new members
            newMembers = newMembers.filter((newMember) => {
                return !prevMembers.some((prevMemberAccount) => {
                    return (
                        prevMemberAccount.toString() ===
                        newMember.account.toString()
                    );
                });
            });

            // re-add previous members in company
            await Member.updateMany(
                {
                    account: {$in: prevMembers},
                    company: req.company._id,
                },
                {
                    removed: false,
                },
            );
            // add new members in company
            members = await Member.create(newMembers);

            const elasticSearchIndexedMembers = await Member.find({
                account: {$in: accounts},
                company: req.company._id,
            }).populate({
                path: 'account',
                select: '_id name firstName lastName email',
            });

            // console.log(elasticSearchIndexedMembers);
            // //notification need account info
            // newMembersForNotification = await elasticSearchIndexedMembers.filter(newMember => {
            //   return !prevMembers.some(prevMemberAccount => {
            //     return (
            //       prevMemberAccount.toString() ===
            //       newMember.account._id.toString()
            //     );
            //   });
            // });
            // console.log(newMembersForNotification);

            createMemberAddNotification(
                req.company._id,
                elasticSearchIndexedMembers,
                {
                    _id: req.user._id,
                    name: req.user.name,
                    pusherSock: req.headers.clientid,
                },
            );

            const memberStructure = (data) => {
                return {
                    mongo_id: data._id,
                    account: data.account,
                    company: data.company,
                };
            };

            await bulkInsert(
                memberIndex,
                elasticSearchIndexedMembers,
                memberStructure,
            );
            logger.info(
                chalk.blueBright(
                    `ElasticSearch successfully Elasticsearch documented with bulk on ${memberIndex}`,
                ),
            );
        }

        // invite new members in company
        if (req.body.pendingTeamMembers.length) {
            const pendingMembersInfo = req.body.pendingTeamMembers.map((m) => {
                return {email: m, company: req.company._id};
            });
            pendingMembers = await PendingMember.create(pendingMembersInfo);

            sendInviteColleague(
                req.user.email,
                req.company,
                req.body.pendingTeamMembers,
            );
        }

        return res.status(201).json({
            message: 'New member created and invitation send',
            members,
            pendingMembers,
        });
    } catch (error) {
        logger.error(`${error}`);
        next(error);
    }
<<<<<<< HEAD
=======

    return res.status(201).json({
      message: 'New member created and invitation send',
      members,
      pendingMembers,
    });
  } catch (error) {
    logger.error(`${error}`);
    next(error);
  }
>>>>>>> fb4e4471... Wip/backend/announcement (#171) (#185)
};

// get all members for a company
const list = async (req, res, next) => {
    try {
        const {limit = 50, skip = 0} = req.query;

        const members = await Member.find({
            company: req.company._id,
            removed: false,
        })
            .sort({createdAt: 1})
            .skip(+skip)
            .limit(+limit)
            .select('-__v -company -createdAt -updatedAt')
            .populate([
                {
                    path: 'account',
                    select: '_id name firstName lastName email',
                },
                {
                    path: 'designations',
                    select: 'division department position',
                    populate: [{path: 'department', select: 'name'}],
                },
            ]);
        return res.status(200).json({
            members,
        });
    } catch (error) {
        logger.error(`${error}`);
        next(error);
    }
};

const pendingList = async (req, res, next) => {
    try {
        const {limit = 50, skip = 0} = req.query;

        const pendingMember = await PendingMember.find({
            company: req.company._id,
            removed: false,
        })
            .sort({createdAt: 1})
            .skip(+skip)
            .limit(+limit)
            .select('-__v -company -createdAt -updatedAt');
        return res.status(200).json({
            pendingMember,
        });
    } catch (error) {
        logger.error(`${error}`);
        next(error);
    }
};

const checkInvitedMemberStatus = async (req, res, next) => {
    try {
        const pendingMember = await PendingMember.findOne({
            email: req.query.email,
            company: req.company._id,
            removed: false,
        }).select('-__v -company -createdAt -updatedAt');

        return res.status(200).json({
            status: !pendingMember,
            message: !pendingMember
                ? `${req.query.email} can be invited.`
                : `${req.query.email} has already been invited.`,
        });
    } catch (error) {
        logger.error(`${error}`);
        next(error);
    }
};

// get a member
const getMember = (req, res, next) => {
    return res.status(200).json({
        member: req.member,
    });
};

// delete a member
const deleteMember = async (req, res, next) => {
    try {
        // check role: superAdmin/admin
        const member = await Member.findOne({
            account: req.user._id,
            company: req.company._id,
        });

        if (!['superAdmin', 'admin'].includes(member.role)) {
            return res.status(403).json({
                message: 'Restricted',
            });
        }

        req.member.removed = true;

        await req.member.save();

        const body = {
            query: {
                term: {
                    mongo_id: req.member._id,
                },
            },
        };

        await deleteDocument(memberIndex, '_doc', body);

        logger.info(
            chalk.blueBright(
                `ElasticSearch successfully deleted  document on ${memberIndex}`,
            ),
        );

        return res.status(200).json({
            message: 'member deleted successfully',
        });
    } catch (error) {
        logger.error(`${error}`);
        next(error);
    }
};

// member will be found on req.member
const getMemberLoad = async (req, res, next) => {
    try {
        const member = await Member.findById(req.params.memberId)
            .populate('account', 'name email firstName lastName')
            .populate('company', 'name');

        if (member) {
            req.member = member;
            return next();
        }
        return res.status(404).json({
            message: 'No valid entry found for provided Member ID',
        });
    } catch (error) {
        logger.error(`${error}`);
        next(error);
    }
};

// 1st step: Find member list from company.
// 2nd step: Create a list of employee
// 3rd step: Exclude them from the Team Search

const searchMember = async (req, res, next) => {
    try {
        const {name} = req.query;
        const companyID = req.company._id;

        const existingMembers = await Member.find({
            company: companyID,
            removed: false,
        }).select('account');

        const existingMembersAccounts = existingMembers.map(
            (member) => member.account,
        );

        if (name) {
            const body = {
                size: 200,
                from: 0,
                query: {
                    bool: {
                        must: [
                            {
                                multi_match: {
                                    query: req.query.name,
                                    type: 'phrase_prefix',
                                    fields: ['email', 'firstName', 'lastName'],
                                },
                            },
                        ],
                        must_not: [
                            {
                                terms: {
                                    mongo_id: existingMembersAccounts,
                                },
                            },
                        ],
                    },
                },
            };

            const response = await search(accountIndex, '_doc', body);

            return sendJSONresponse(res, 200, {
                success: true,
                message: `Search complete for ${name}`,
                data: response.hits.hits,
            });
        }
        return sendErrorResponse(res, 400, 'EmptySearchError', {
            message: 'query error',
        });
    } catch (error) {
        logger.error(`${error}`);
        next(error);
    }
};

module.exports = {
    addMember,
    list,
    pendingList,
    getMember,
    deleteMember,
    getMemberLoad,
    searchMember,
    changeRole,
    checkInvitedMemberStatus,
};
