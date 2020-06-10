const httpStatus = require('http-status');
const logger = require('../../config/winston');
const {APIError, BadRequestError} = require('../helpers/APIError');
const Activity = require('./activity.model');

const list = (req, res, next) => {
    const {model, recordId} = req.params;
    Activity.find({
        [model]: recordId,
    })
        .select('_id name type')
        .sort({createdAt: -1})
        .exec()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((e) => next(e));
};

const create = async (name, type, reference, user, next) => {
    try {
        const activity = new Activity({
            name,
            type,
            task: reference,
            account: user._id,
        });
        await activity
            .save()
            .then((createdActivity) => {})
            .catch((e) => next(e));
    } catch (error) {
        logger.error(`Activity create: ${error}`);
        const err = new BadRequestError(
            'Activity data is invalid.',
            httpStatus.BAD_REQUEST,
        );
        next(err);
    }
};

module.exports = {list, create};
