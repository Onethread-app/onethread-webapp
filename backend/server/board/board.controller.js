const Board = require('./board.model');
const BoardColumn = require('./../boardColumn/boardColumn.model');
const { Member } = require('../company/member/member.model');
const logger = require('../../config/winston');
const {
  sendErrorResponse,
  sendJSONresponse,
} = require('../helpers/jsonResponse');
const { Project } = require('../project/project.model');
const {
  createBoardNotification,
} = require('../notification/notification.controller');
const { Team } = require('../team-member/team.model');

const createBoard = async (
  name,
  project,
  department,
  color,
  account,
) => {
  const board = new Board({
    name,
    department: department && department,
    color: color ? color : 0,
    account,
    project,
    members: [account],
  });
  const createdBoard = await board.save();
  await BoardColumn.create({
    name: 'To do',
    type: 'to-do',
    project,
    account,
    positionInBoard: 1,
    boardId: board._id,
  });
  await BoardColumn.create({
    name: 'In progress',
    type: 'in-progress',
    project,
    account,
    positionInBoard: 2,
    boardId: board._id,
  });
  await BoardColumn.create({
    name: 'Done',
    type: 'done',
    project,
    account,
    positionInBoard: 3,
    boardId: board._id,
  });

  logger.info(`Board Created Successfully.`);

  return createdBoard;
};

const addToBoard = async (boardID, memberID) => {
  // update board
  await Board.updateOne(
    { _id: boardID },
    { $addToSet: { members: memberID } },
    { safe: true, upsert: true, new: true },
  ).populate('members', '_id name');
};

const load = (req, res, next, id) => {
  Board.findById(id)
    .exec()
    .then((result) => {
      req.board = result;
      return next();
    })
    .catch((err) => {
      return sendErrorResponse(res, 404, 'Idisnotexits', {
        success: false,
        message: 'No valid entry found for provided Board ID',
      });
    });
};

const get = async (req, res, next) => {
  const boardObj = await Board.findById(req.board._id)
    .populate('members', '_id name color')
    .exec()
    .then((result) => result)
    .catch((err) => {
      next(err);
    });
  await BoardColumn.find({
    boardId: req.board._id,
    removed: false,
  })
    .select('_id name tasks positionInBoard')
    .populate('tasks', '_id name color description dueDate')
    .exec()
    .then((colResult) => {
      const responseResult = {
        _id: boardObj._id,
        name: boardObj.name,
        description: boardObj.description,
        members: boardObj.members,
        columns: colResult,
      };
      return sendJSONresponse(res, 200, responseResult);
    })
    .catch((e) => {
      logger.error(`${e}`);
      next(e);
    });
};

const create = async (req, res, next) => {
  try {
    const createdBoard = await createBoard(
      req.body.name,
      req.query.pid,
      req.body.department,
      req.body.color,
      req.user._id,
    );
    const project = await Project.findOne({
      _id: req.query.pid,
    }).select('_id name company'); //company name in header can remove that

    //${associate.associateCompany.name} ata dynamic korte hobe nyle future name change korleo ai prev name thke jabe

    const text = `${req.user.name} has created a board ${req.body.name} from ${project.name}`;
    createBoardNotification(
      {
        project: project._id,
        company: project.company,
        _id: createdBoard._id,
      },
      {
        _id: req.user._id,
        name: req.user.name,
        pusherSock: req.headers.clientid,
      },
      text,
    );
    // const createdBoard = await board.save();

    return res.status(201).json(createdBoard);
  } catch (error) {
    logger.error(`Board create: ${error}`);
    next(error);
  }
};

const update = (req, res, next) => {};

const addBoardMembers = async (req, res, next) => {
  try {
    const boardID = req.params.boardId;
    const memberID = req.body.memberId;
    // updating Board
    await addToBoard(boardID, memberID);

    const board = await Board.findOne({
      _id: boardID,
    })
      .populate('project', '_id name company')
      .populate('members', 'name');

    const newBoardMember = board.members
      .filter(
        (value) =>
          value._id.toString() ===
          memberID[memberID.indexOf(value._id.toString())],
      )
      .map((m) => m.name);

    const text = `${req.user.name} has added  ${newBoardMember} in ${board.name} from ${board.project.name}`;

    createBoardNotification(
      {
        project: board.project._id,
        company: board.project.company,
        _id: board._id,
      },
      {
        _id: req.user._id,
        name: req.user.name,
        pusherSock: req.headers.clientid,
      },
      text,
    );
    const memberList = board.members;
    return sendJSONresponse(res, 200, memberList);
  } catch (error) {
    next(error);
  }
};

const addBoardColumn = (req, res, next) => {};

const list = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;

  await Board.find({
    project: req.query.pid,
  })
    .select('_id name color department members')
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then((result) => {
      logger.info(`successfully board list show to board team`);
      return sendJSONresponse(res, 200, result);
    })
    .catch((e) => {
      logger.error(e);
      next(e);
    });
};

const remove = (req, res, next) => {
  const board = req.board;
  // remove task
  // remove column
  // remove board
};

const suggestMember = async (req, res, next) => {
  try {
    let boardMembers = await Board.findById(req.params.boardId)
      .select('-_id members')
      .populate('members', '_id name')
      .exec();
    //now it will check form project team by projectId
    let projectMembers = await Team.find({
      project: req.query.pid,
    })
      .select('-_id account')
      .populate('account', '_id name')
      .exec();
    let members = projectMembers.filter(({ account }) => {
      return !boardMembers.members.some((existingMember) => {
        return (
          existingMember._id.toString() === account._id.toString()
        );
      });
    });

    members = members.map((m) => m.account);

    return sendJSONresponse(res, 200, members);
  } catch (error) {
    logger.error(`Board Details: ${error}`);
    next(error);
  }
};

module.exports = {
  load,
  get,
  create,
  list,
  remove,
  update,
  addBoardMembers,
  addBoardColumn,
  suggestMember,
  createBoard,
  addToBoard,
};
