// const { Room } = require('./room.model');
// const { Member } = require('../company/member/member.model');
// // const { Company } = require('../company/company.model');
// const { Project } = require('../project/project.model');
// const { chatkit } = require('../services/pusher.services');
// const logger = require('../../config/winston');
// const _ = require('lodash');
// const { sendJSONresponse, sendErrorResponse} = require('../helpers/jsonResponse');
// const create = async (req, res, next) => {
//   try {
//     // check room already exists with same company
//     const duplicate = await Room.findOne({
//       name: req.body.name,
//       company: req.body.pid,
//     });
//     if (duplicate) { 
//       return sendErrorResponse(res, 409, 'DuplicateRoomError', {message: `Room already exists`})
//     }
//     const room = new Room({
//       name: req.body.name,
//       // company: req.body.company,
//       pid: req.body.pid,
//       members: [req.user._id],
//       account: req.user._id,
//     });
//     await room.save();
//     //will remove future
//     await Project.findByIdAndUpdate(
//       req.body.pid,
//       {
//         $addToSet: {
//           rooms: { $each: [room._id] },
//         },
//       },
//       { new: true },
//     );

//     await chatkit.createRoom({
//       id: room._id,
//       creatorId: req.user._id,
//       name: room.name,
//       isPrivate: true,
//       customData: {
//         pid: req.body.pid,
//       },
//     });
//     return sendJSONresponse(res, 201, room);
//   } catch (e) {
//     next(e);
//   }
// };

// const addMembers = async (req, res) => {
//   Room.updateOne(
//     { _id: req.body.room },
//     {
//       $addToSet: {
//         members: { $each: req.body.members },
//       },
//     },
//   )
//     .exec()
//     .then(result => {
//       if (result) {
//         chatkit
//           .addUsersToRoom({
//             roomId: req.body.room,
//             userIds: req.body.members,
//           })
//           .then(() =>
//             res.status(201).json({
//               message: 'new members added into room',
//             }),
//           )
//           .catch(err => res.status(500).json({ error: err }));
//       } else {
//         res.status(404).json({ message: 'No room found' });
//       }
//     })
//     .catch(err => {
//       res.status(500).json({ error: err });
//     });
// };

// const memberList = async (req, res, next) => {
//   Room.findById(req.params.roomId)
//     .populate([
//       {
//         path: 'members',
//         select: 'name firstName lastName email profileImage',
//         populate: {
//           path: 'profileImage',
//           select: '-_id link',
//         },
//       },
//     ])
//     .exec()
//     .then(({ members }) => res.json({ members: members }))
//     .catch(e => next(e));
// };

// const suggestMember = async (req, res, next) => {
//   //req.params.roomId empty check require
//   try {
//     let roomMembers = await Room.findById(req.params.roomId)
//       .select('-_id members')
//       .populate('members', '_id name')
//       .exec();

//     let companyMembers = await Member.find({
//       company: req.params.companyId,
//     })
//       .select('-_id account')
//       .populate('account', '_id name firstName lastName email')
//       .exec();
//     let members = companyMembers.filter(({ account }) => {
//       return !roomMembers.members.some(existingMember => {
//         return (
//           existingMember._id.toString() === account._id.toString()
//         );
//       });
//     });
//     // TODO: it will execute in client
//     // members empty check
//     members = members.map(m => m.account);

//     return res.status(200).json({
//       members,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const list = async (req, res) => {
//   const { limit = 50, skip = 0 } = req.query;

//   Room.find({ company: req.params.company, removed: false })
//     .sort({ created: 1 })
//     .skip(+skip)
//     .limit(+limit)
//     .select('-__v -members')
//     .exec()
//     .then(rooms =>
//       res.status(200).json({
//         rooms,
//       }),
//     )
//     .catch(e => next(e));
// };

// const recheckMembersWithChatkit = async (req, res) => {
//   let rooms = await Room.find({
//     company: req.body.company,
//     removed: false,
//   });

//   if (!rooms) {
//     return res.status(400).json({
//       message: 'No rooms found',
//     });
//   }

//   logger.info(`Company : ${req.body.company}`);

//   rooms.forEach(room => {
//     let chunkMembers = _.chunk(room.members, 10);
//     chunkMembers.forEach(members => {
//       chatkit
//         .addUsersToRoom({
//           roomId: room._id,
//           userIds: members,
//         })
//         .then(() =>
//           logger.info(
//             `${members.length} Chunk members added in Room: ${room.name}`,
//           ),
//         )
//         .catch(err =>
//           logger.error(
//             `Failed to add members in chatkit for ${members.length} Chunk members while added in Room: ${room.name}`,
//           ),
//         );
//     });
//   });

//   return res.status(200).json({
//     rooms,
//   });
// };

// module.exports = {
//   create,
//   list,
//   addMembers,
//   suggestMember,
//   memberList,
//   recheckMembersWithChatkit,
// };
