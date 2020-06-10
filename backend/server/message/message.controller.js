const mongoose = require('mongoose');
const {Message} = require('./message.model');
const {Room} = require('../room/room.model');
const {RoomMember} = require('../room/roomMember.model');
const Account = require('../account/account.model');
const {pusherChannel} = require('../services/pusher.services');
const File = require('../file/file.model');
// const ElasticsearchService  = require('../../index.elasticsearch');
// const { messageMapping , messageStructure } = require('../services/elastic.services');
// const elasticService = new ElasticsearchService();
// elasticService.createMessages('messages', Message , messageMapping , messageStructure);
const logger = require('../../config/winston');
const {
    sendJSONresponse,
    sendErrorResponse,
} = require('../helpers/jsonResponse');

const unreadMessageCounts = async (req, res, next) => {
    try {
        const rooms = await RoomMember.find({
            account: req.user._id,
            removed: false,
        }).select('-_id room lastSeen');

        const roomsUnreadCount = {};
        for (const e of rooms) {
            const results = await Message.aggregate([
                {
                    $match: {
                        removed: false,
                        room: mongoose.Types.ObjectId(e.room),
                        // room: {
                        //   $in: roomObjectIDs,
                        // },
                        createdAt: {
                            $gt: new Date(e.lastSeen),
                        },
                    },
                },
                {
                    $group: {
                        _id: '$room',
                        count: {
                            $sum: 1,
                        },
                    },
                },
            ]);

            if (results.length > 0) {
                roomsUnreadCount[results[0]._id] = results[0].count;
            } else {
                roomsUnreadCount[e.room._id] = 0;
            }
        }

        res.status(200).json({
            roomsUnreadCount,
        });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    // Check for JSON
    if (!req.is('application/json')) {
        return sendErrorResponse(res, 406, 'ContentTypeError', {
            message: "Expects 'application/json'",
        });
    }

    try {
        const room = await Room.findById(req.body.room);
        if (!room) {
            return res.status(404).json({
                message: 'No room exists',
            });
        }

        const files = req.body.files.map((file) => file._id);

        const newMessage = new Message({
            text: req.body.text,
            room: req.body.room,
            type: req.body.type,
            files,
            account: req.user._id,
        });

        const account = await Account.findById(req.user._id).select(
            'name firstName lastName email profileImage',
        );

        const message = await newMessage.save();

        pusherChannel.trigger(`private-${req.body.room}`, 'new_message', {
            message,
            account,
            files: req.body.files,
        });

        await File.updateMany(
            {_id: {$in: files}},
            {
                message: message._id,
                room: message.room,
            },
        );

        // const response =  await elasticService.set('messages' ,'_doc' , {
        //   mongo_id: message._id.toString(),
        //   room: message.room,
        //   account: message.account,
        //   text: message.text,
        //   type: message.type,
        //   files: req.body.files
        // });

        return res.status(201).json({
            message,
        });
    } catch (error) {
        next(error);
    }
};

const getRoomMessages = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.roomId);
        if (!room) {
            return res.status(404).json({
                message: 'No room exists',
            });
        }

        const {limit = 15, skip = 0} = req.query;

        const messages = await Message.find({
            room: req.params.roomId,
            removed: false,
        })
            .select('-__v')
            .populate('files', '')
            .populate([
                {
                    path: 'account',
                    select: 'name firstName lastName email profileImage',
                },
                {
                    path: 'files',
                    select: 'link s3Key type',
                },
            ])
            .sort({createdAt: -1})
            .skip(+skip)
            .limit(+limit);

        return res.status(200).json({
            count: messages.length,
            messages,
        });
    } catch (error) {
        next(error);
    }
};

const getRoomFiles = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.roomId);
        if (!room) {
            return res.status(404).json({
                message: 'No room exists',
            });
        }

        const {limit = 25, skip = 0} = req.query;

        const files = await Message.find({
            room: req.params.roomId,
            type: {$in: ['file', 'attachment']},
            removed: false,
        })
            .select('-__v')
            .populate('files', '')
            .populate([
                {
                    path: 'account',
                    select: 'name firstName lastName email profileImage',
                },
                {
                    path: 'files',
                    select: 'link s3Key type',
                },
            ])
            .sort({createdAt: -1})
            .skip(+skip)
            .limit(+limit);

        return res.status(200).json({
            count: files.length,
            files,
        });
    } catch (error) {
        next(error);
    }
};

const getRoomDiscussion = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.roomId);
        if (!room) {
            return res.status(404).json({
                message: 'No room exists',
            });
        }

        const {limit = 15, skip = 0} = req.query;

        const discussion = await Message.find({
            room: req.params.roomId,
            type: {$in: ['text', 'attachment']},
            discussion: true,
            removed: false,
        })
            .select('text room createdAt updatedAt')
            .sort({createdAt: -1})
            .skip(+skip)
            .limit(+limit);

        return res.status(200).json({
            count: discussion.length,
            discussion,
        });
    } catch (error) {
        logger.error(`${error}`);
        next(error);
    }
};

const toggleDiscussion = async (req, res, next) => {
    try {
        const discussion = await Message.findOneAndUpdate(
            {
                _id: req.params.messageId,
            },
            {
                discussion: req.body.discussion,
            },
            {new: true},
        );

        if (!discussion) {
            return res.status(404).json({
                message: 'No message exists.',
            });
        }

        return res.status(200).json({
            message: `Message ${
                req.body.discussion ? 'highlighted' : 'removed from highlighted'
            }.`,
            discussion,
        });
    } catch (error) {
        next(error);
    }
};

const searchMessage = async (req, res, next) => {
    try {
        const {name} = req.query;
        const {roomId} = req.params;

        if (name) {
            const body = {
                size: 200,
                from: 0,
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    room: {
                                        value: roomId,
                                    },
                                },
                            },
                            {
                                multi_match: {
                                    query: name,
                                    fields: ['text', 'files.s3Key'],
                                },
                            },
                        ],
                    },
                },
            };

            // const response = await elasticService.search('messages','_doc',body);

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
    create,
    getRoomMessages,
    getRoomFiles,
    getRoomDiscussion,
    toggleDiscussion,
    searchMessage,
    unreadMessageCounts,
};
