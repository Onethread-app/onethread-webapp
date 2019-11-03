const Room = require('./room.model');
<<<<<<< HEAD
const { Company } = require('../company/company.model');
=======
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
const serviceRoom = require('./room.service');
const { chatkit } = require('../services/pusher.services');
const mongoose = require('mongoose');

<<<<<<< HEAD
=======


>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
const create = async (req, res, next) => {
  const room = new Room({
    name: req.body.name,
    company: req.body.company,
    members: [req.user.id],
    account: req.user.id,
  });
<<<<<<< HEAD
=======
 
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058

  try {
    await room.save();
    //will remove future
    await mongoose.model('Company').findByIdAndUpdate(
      req.body.company,
      {
        $addToSet: {
          rooms: { $each: [room._id] },
        },
      },
      { new: true },
    );

    await chatkit.createRoom({
      id: room._id,
      creatorId: req.user._id,
      name: room.name,
    });

    res.send(room);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

function remove(req, res, next) {}

function edit(req, res) {}

const list = async (req, res) => {
  const { limit = 50, skip = 0 } = req.query;
<<<<<<< HEAD

=======
  
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
  Room.find({ company: mongoose.Types.ObjectId(req.params.company) })
    .sort({ created: 1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(result => res.json(result))
    .catch(e => next(e));
};

const listByWorkplace = (req, res) => {
  const { limit = 5, skip = 0, workplace = '' } = req.query;
  Workplace.find({ workplace: workplace, removed: false })
    .sort({ createdAt: 1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(result => res.json(result))
    .catch(e => next(e));
};

<<<<<<< HEAD
const roomMemberSearch = async (req, res, next) => {
  // const name = req.query.name;
  // const cid = req.body.company;
  // const room = req.body.room;
  // let options = [
  //   {
  //     path: 'members',
  //     select: '_id account',
  //     populate: {
  //       path: 'account',
  //       select: 'name email',
  //     },
  //   },
  //   {
  //     path: 'rooms',
  //     select: 'members',
  //     populate: {
  //       path: 'members',
  //       select: 'name',
  //     },
  //   },
  // ];
  // const roomMemberList = await Company.findById({
  //   _id: cid,
  // }).populate(options);
  // return res.send(roomMemberList);
  // const roomMemberListId = [roomMemberList.members.account];
  // const roomMemberListId = [companyMemberList.account.name];
  // if (name === '') {
  //   const err = new BadRequestError(
  //     'Nothing Submitted',
  //     httpStatus.BAD_REQUEST,
  //     true,
  //   );
  //   logger.error(`Query Error: ${err}`);
  //   return next(err);
  // }
  // Company.find({ name: { $regex: name, $nin: memberListId } })
  //   .select('_id email name')
  //   .then(data => {
  //     if (data.length < 1) {
  //       const err = new SearchNotMatchError(
  //         'Query does not found',
  //         httpStatus.BAD_REQUEST,
  //         true,
  //       );
  //       logger.error(`Query Error: ${err}`);
  //       return next(err);
  //     } else {
  //       logger.info(`Search complete ${name}`);
  //       return sendJSONresponse(res, 200, {
  //         employees: {
  //           success: true,
  //           message: `Search complete ${name}`,
  //           data,
  //         },
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     return next(err);
  //   });
};

module.exports = { create, list, listByWorkplace, roomMemberSearch };
=======
function read(req, res) {}

function invite(req, res) {}

module.exports = { create, list, listByWorkplace };
>>>>>>> 5d23780b51e807ad76d91ac0ebe217229b08f058
