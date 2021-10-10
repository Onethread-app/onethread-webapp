const Board = require('../../board/board.model');
const logger = require('../../../config/winston');

const findBoardById = async (_id) => {
  return await Board.findById({ _id: _id })
    .select('name members')
    .populate('members', 'account')
    .exec();
};
module.exports = {
  findBoardById,
};
